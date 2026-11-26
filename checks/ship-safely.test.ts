import { describe, expect, it } from "vitest";
import { testApi } from "../apps/api/src/testing";

const ADD = `mutation ($id: ID!, $rating: Int!) { addReview(bookId: $id, rating: $rating, body: "Great") { rating author { id } } }`;

describe("Ship safely: reviews", () => {
  it("records the review as the signed-in user, not a user named in the request", async () => {
    const api = testApi();
    const { data, errors } = await api.query(ADD, { id: "1", rating: 5 }, "ada");
    expect(errors).toBeUndefined();
    expect(data?.addReview.author.id).toBe("ada");
  });

  it("requires a signed-in user to review", async () => {
    const { errors } = await testApi().query(ADD, { id: "1", rating: 5 });
    expect(errors?.[0]?.extensions?.code).toBe("UNAUTHENTICATED");
  });

  it("only accepts ratings from 1 to 5", async () => {
    const { errors } = await testApi().query(ADD, { id: "1", rating: 6 }, "ada");
    expect(errors?.[0]?.extensions?.code).toBe("BAD_INPUT");
  });

  it("returns null, not an error, for the average of a book with no reviews", async () => {
    const { data, errors } = await testApi().query(`{ book(id: "3") { averageRating } }`);
    expect(errors).toBeUndefined();
    expect(data?.book.averageRating).toBeNull();
  });

  it("treats search text as text, not SQL", async () => {
    const api = testApi();
    await api.query(ADD, { id: "1", rating: 4 }, "ada");
    const { data, errors } = await api.query(`{ searchReviews(text: "x' OR '1'='1") { id } }`);
    expect(errors).toBeUndefined();
    expect(data?.searchReviews).toEqual([]);
  });
});
