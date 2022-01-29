import { signInWithPopup, signOut } from "firebase/auth";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "../lib/context";
import { auth, googleProvider } from "../lib/firebase";
import { db } from "../lib/firebase";
import { doc, getDoc, writeBatch } from "firebase/firestore";

export default function Enter() {
  const { user, username } = useContext(UserContext);

  return (
    <main>
      <h1>Sign Up</h1>
      {user ? (
        !username ? (
          <UserNameForm />
        ) : (
          <SignOutButton />
        )
      ) : (
        <SignInButton />
      )}
    </main>
  );
}

function SignInButton() {
  const signInwithGoogle = async () => {
    try {
      const res = await signInWithPopup(auth, googleProvider);
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <button className="btn-google" onClick={signInwithGoogle}>
      <img src="https://www.freepnglogos.com/uploads/google-logo-png/google-logo-png-suite-everything-you-need-know-about-google-newest-0.png" />
      Sign In with Google
    </button>
  );
}

function SignOutButton() {
  return (
    <button
      onClick={() =>
        signOut(auth)
          .then(() => {
            console.log("sign out successFul");
          })
          .catch()
      }
    >
      Sign Out
    </button>
  );
}

function UserNameForm() {
  const [formValue, setFormValue] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);

  const { user, username, setUserName } = useContext(UserContext);

  useEffect(() => {
    let interval = setTimeout(() => {
      checkUsername(formValue);
    }, 1500);

    return () => {
      clearInterval(interval);
    };
  }, [formValue]);

  const checkUsername = async (username) => {
    if (username.length >= 3) {
      const docRef = doc(db, "usernames", username);
      const docSnap = await getDoc(docRef);
      console.log("firestore read excuted");
      if (docSnap.exists()) {
        setIsValid(false);
        setLoading(false);
      } else {
        setIsValid(true);
        setLoading(false);
      }
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    const usersDocref = doc(db, "users", `${user.uid}`);
    const usernamesDocRef = doc(db, "usernames", formValue);

    const batch = writeBatch(db);

    batch.set(usersDocref, {
      username: formValue,
      photoURL: user.photoURL,
      displayName: user.displayName,
    });
    batch.set(usernamesDocRef, { uid: user.uid });

    await batch.commit();
  };
  const changeHandler = (e) => {
    const val = e.target.value.toLowerCase();
    const re = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    // Only set form value if length is < 3 OR it passes regex
    if (val.length < 3) {
      setFormValue(val);
      setLoading(false);
      setIsValid(false);
    }

    if (re.test(val)) {
      setFormValue(val);
      setLoading(true);
      setIsValid(false);
    }
  };

  function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
      return <p>Checking...</p>;
    } else if (isValid) {
      return <p className="text-success">{username} is availaible!</p>;
    } else if (username && !isValid) {
      return <p className="text-danger">That username is taken!</p>;
    } else {
      return <p></p>;
    }
  }

  return (
    !username && (
      <section>
        <h3>Choose Username</h3>
        <form onSubmit={submitHandler}>
          <input
            type="text"
            name="username"
            placeholder="username"
            value={formValue}
            onChange={changeHandler}
          />
          <UsernameMessage
            username={formValue}
            loading={loading}
            isValid={isValid}
          />
          <button type="submit" className="btn-green" disabled={!isValid}>
            Choose
          </button>
        </form>

        <h3>Debug state</h3>
        <div>
          Username: {formValue}
          <br />
          Loading: {loading.toString()}
          <br />
          Username Valid : {isValid.toString()}
        </div>
      </section>
    )
  );
}
