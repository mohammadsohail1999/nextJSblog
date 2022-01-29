import { async } from "@firebase/util";
import { collection, doc, increment, writeBatch } from "firebase/firestore";
import { db, auth } from "../lib/firebase";
import { useGetHeart } from "../lib/hooks";

export default function HeartButton({ postRef }) {
  //   addHeart(postRef);

  const postRefArr = postRef.split("/");

  const [heart] = useGetHeart(postRef);

  const removeHeart = async () => {
    const batch = writeBatch(db);
    const postRef = doc(
      db,
      postRefArr[0],
      postRefArr[1],
      postRefArr[2],
      postRefArr[3]
    );
    const heartsRef = doc(
      db,
      postRefArr[0],
      postRefArr[1],
      postRefArr[2],
      postRefArr[3],
      "hearts",
      auth.currentUser.uid
    );

    batch.update(postRef, { heartCount: increment(-1) });
    batch.delete(heartsRef);

    await batch.commit();
  };

  const addHeart = async () => {
    const batch = writeBatch(db);
    const postRef = doc(
      db,
      postRefArr[0],
      postRefArr[1],
      postRefArr[2],
      postRefArr[3]
    );
    const heartsRef = doc(
      db,
      postRefArr[0],
      postRefArr[1],
      postRefArr[2],
      postRefArr[3],
      "hearts",
      auth.currentUser.uid
    );

    batch.update(postRef, { heartCount: increment(1) });
    batch.set(heartsRef, { uid: auth.currentUser.uid });

    await batch.commit();
  };

  if (heart?.exists()) {
    return <button onClick={removeHeart}>💔 Unheart </button>;
  }

  return <button onClick={addHeart}>❤️ Heart</button>;
}
