import firebase from "firebase";
import { createContext, ReactNode, useState, useEffect } from "react";
import { auth } from "../services/firebase";

type User = {
    id: string;
    name: string;
    avatar: string;
  }
  
type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}
  
type Props = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType);

export const AuthContextProvider = (props: Props) => {
  const [user, setUser] = useState<User>();
  
  useEffect(() => {
    const unsubscribre = auth.onAuthStateChanged(user => {
      if (user) { 
        const { displayName, photoURL, uid } = user;
        
        if (!photoURL || !displayName) {
          throw new Error('Falta de informações da sua conta Google.');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        })    
      }
    });

    return () => {
      unsubscribre();
    }
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
  
      const result = await auth.signInWithPopup(provider);

      if (result.user) {
        const { displayName, photoURL, uid } = result.user;
        
        if (!photoURL || !displayName) {
          throw new Error('Falta de informações da sua conta Google.');
        }

        setUser({
          id: uid,
          name: displayName,
          avatar: photoURL,
        })  
      }
    } catch (error) {
      alert('Erro ao efetuar o login com o Google.');
		}
  };
  
	return (
    <AuthContext.Provider value={{ user, signInWithGoogle }}>
      {props.children}
    </AuthContext.Provider>
	);
};
