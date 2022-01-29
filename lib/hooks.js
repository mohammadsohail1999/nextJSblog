import { auth, db } from "../lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
} from "firebase/firestore";
import { useState, useEffect } from "react";
import { async } from "@firebase/util";

export const useUserData = () => {
  const [userName, setUserName] = useState(null);

  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });
  }, []);

  // console.log(user, userName);

  useEffect(() => {
    let unsubscribe;
    const getSnapshot = async () => {
      if (user) {
        const userDocref = doc(db, "users", user.uid);
        unsubscribe = onSnapshot(userDocref, (doc) => {
          setUserName(doc.data()?.username);
        });
      } else {
        setUserName(null);
      }
    };
    getSnapshot();

    return () => {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, [user]);

  return { user, userName, setUserName };
};

export const getUserPost = (ref) => {
  const refArr = ref.split("/");

  const [post, setPost] = useState(null);

  useEffect(() => {
    let unsubscribe;
    if (refArr.length) {
      unsubscribe = onSnapshot(
        doc(db, refArr[0], refArr[1], refArr[2], refArr[3]),
        (doc) => {
          setPost(doc.data());
        }
      );
    }
    return function () {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  // console.log(refarr);
  return { post };
};

export const getUserPosts = (id) => {
  const [posts, setPosts] = useState([]);

  const postcollectionRef = collection(db, "users", id, "posts");

  const postquery = query(postcollectionRef, orderBy("createdAt", "asc"));

  useEffect(() => {
    let unsubscribe = onSnapshot(postquery, (querySnapshot) => {
      let postsarr = [];
      querySnapshot.forEach((doc) => {
        postsarr.push(doc.data());
      });
      setPosts(postsarr);
    });
    return function () {
      unsubscribe();
    };
  }, []);

  return [posts];
};

export const useGetRealtimePost = (uid, slug) => {
  const [post, setPost] = useState(null);

  useEffect(() => {
    let unsubScribe;
    const getPost = async () => {
      const PostRef = collection(db, "users", uid, "posts");

      unsubScribe = onSnapshot(doc(PostRef, slug), (doc) => {
        setPost(doc.data());
      });
    };

    getPost();

    return function () {
      return unsubScribe();
    };
  }, []);

  return [post];
};

export const useGetHeart = (ref) => {
  const refArr = ref.split("/");

  const [heart, setHeart] = useState(null);

  useEffect(() => {
    let unsubscribe;
    if (refArr.length) {
      unsubscribe = onSnapshot(
        doc(
          db,
          refArr[0],
          refArr[1],
          refArr[2],
          refArr[3],
          "hearts",
          auth.currentUser.uid
        ),
        (doc) => {
          setHeart(doc);
        }
      );
    }
    return function () {
      if (typeof unsubscribe === "function") {
        unsubscribe();
      }
    };
  }, []);

  return [heart];
};
