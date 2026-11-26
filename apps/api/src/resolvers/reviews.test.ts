import { describe, expect, it } from "vitest";
import { testApi } from "../testing";

const ADD = `mutation ($id: ID!, $rating: Int!, $body: String!, $author: ID!) {
  addReview(bookId: $id, rating: $rating, body: $body, authorId: $author) { rating author { id } }
}`;

describe("reviews", () => {
  it("adds a review", async () => {
    const api = testApi();
    const { data } = await api.query(ADD, { id: "1", rating: 4, body: "Great read", author: "ada" });
    expect(data?.addReview).toEqual({ rating: 4, author: { id: "ada" } });
  });

  it("averages ratings to one decimal place", async () => {
    const api = testApi();
    await api.query(ADD, { id: "1", rating: 4, body: "Great read", author: "ada" });
    await api.query(ADD, { id: "1", rating: 5, body: "Loved it", author: "grace" });
    const { data } = await api.query(`{ book(id: "1") { averageRating reviews { body } } }`);
    expect(data?.book.averageRating).toBe(4.5);
    expect(data?.book.reviews).toHaveLength(2);
  });

  it("searches review text", async () => {
    const api = testApi();
    await api.query(ADD, { id: "1", rating: 4, body: "Great read", author: "ada" });
    const { data } = await api.query(`{ searchReviews(text: "great") { body } }`);
    expect(data?.searchReviews).toEqual([{ body: "Great read" }]);
  });
});
