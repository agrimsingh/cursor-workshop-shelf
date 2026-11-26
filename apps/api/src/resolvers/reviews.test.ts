import { describe, expect, it } from "vitest";
import { testApi } from "../testing";

const ADD = `mutation ($id: ID!, $rating: Int!, $body: String!) {
  addReview(bookId: $id, rating: $rating, body: $body) { rating author { id } }
}`;

describe("reviews", () => {
  it("adds a review as the signed-in user", async () => {
    const api = testApi();
    const { data } = await api.query(ADD, { id: "1", rating: 4, body: "Great read" }, "ada");
    expect(data?.addReview).toEqual({ rating: 4, author: { id: "ada" } });
  });

  it("requires a signed-in user", async () => {
    const { errors } = await testApi().query(ADD, { id: "1", rating: 4, body: "Great read" });
    expect(errors?.[0]?.extensions?.code).toBe("UNAUTHENTICATED");
  });

  it("rejects ratings outside 1 to 5", async () => {
    const api = testApi();
    for (const rating of [0, 6]) {
      const { errors } = await api.query(ADD, { id: "1", rating, body: "Hmm" }, "ada");
      expect(errors?.[0]?.extensions?.code).toBe("BAD_INPUT");
    }
  });

  it("averages ratings to one decimal place, and is null with no reviews", async () => {
    const api = testApi();
    expect((await api.query(`{ book(id: "1") { averageRating } }`)).data?.book.averageRating).toBeNull();

    await api.query(ADD, { id: "1", rating: 4, body: "Great read" }, "ada");
    await api.query(ADD, { id: "1", rating: 5, body: "Loved it" }, "grace");
    const { data } = await api.query(`{ book(id: "1") { averageRating reviews { body } } }`);
    expect(data?.book.averageRating).toBe(4.5);
    expect(data?.book.reviews).toHaveLength(2);
  });

  it("searches review text, treating the search as text", async () => {
    const api = testApi();
    await api.query(ADD, { id: "1", rating: 4, body: "Great read" }, "ada");
    expect((await api.query(`{ searchReviews(text: "great") { body } }`)).data?.searchReviews).toEqual([
      { body: "Great read" },
    ]);
    expect((await api.query(`{ searchReviews(text: "x' OR '1'='1") { body } }`)).data?.searchReviews).toEqual([]);
  });
});
