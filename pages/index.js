import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

import Loader from "../components/Loader";
import toast from "react-hot-toast";
import {
  collectionGroup,
  getDocs,
  getFirestore,
  orderBy,
  limit,
  startAfter,
  query,
  where,
  Timestamp,
} from "firebase/firestore";
import { postToJSON } from "../lib/firebase";
import { useState } from "react";
import PostFeed from "../components/PostFeed";

// max post to query per page
const LIMIT = 1;

export async function getServerSideProps(context) {
  const ref = collectionGroup(getFirestore(), "posts");
  const postsQuery = query(
    ref,
    where("published", "==", true),
    orderBy("createdAt", "desc"),
    limit(LIMIT)
  );

  const posts = (await getDocs(postsQuery)).docs.map(postToJSON);

  return {
    props: { posts },
  };
}

export default function Home(props) {
  const [posts, setPosts] = useState(props.posts);
  const [loading, setLoading] = useState(false);

  const [postsEnd, setPostsEnd] = useState(false);

  const getMorePosts = async () => {
    setLoading(true);
    const last = posts[posts.length - 1];
    const ref = collectionGroup(getFirestore(), "posts");

    const cursor =
      typeof last.createdAt === "number"
        ? Timestamp.fromMillis(last.createdAt)
        : last.createdAt;

    const postsQuery = query(
      ref,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      startAfter(cursor),
      limit(LIMIT)
    );

    const newPosts = (await getDocs(postsQuery)).docs.map(postToJSON);

    setPosts(posts.concat(newPosts));

    if (newPosts.length < LIMIT) {
      setPostsEnd(true);
    }

    setLoading(false);
  };

  return (
    <main>
      <PostFeed posts={posts} />

      {!loading && !postsEnd && (
        <button onClick={getMorePosts}>Load More</button>
      )}
      <Loader show={loading} />

      {postsEnd && "You have reached the end!"}
    </main>
  );
}
