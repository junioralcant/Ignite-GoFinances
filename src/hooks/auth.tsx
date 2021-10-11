import React, { 
    useContext, 
    createContext, 
    ReactNode,
    useState
} from 'react';

const { CLIENT_ID } = process.env
const { REDIRECT_URI } = process.env

import * as AuthSession from 'expo-auth-session';
import * as AppleAuthentication from 'expo-apple-authentication';

interface AuthProviderProps{
    children: ReactNode;
}

interface User {
    id: string;
    name: string;
    email: string;
    photo?: string;
}

interface IAuthContextData {
    user: User;
    signInWithGoogle(): Promise<void>;
}

interface AuthorizationResponse{
    params: {
        access_token: string; 
    };
    type: string;
}

export const AuthContext = createContext({ } as IAuthContextData);

function AuthProvider({ children }: AuthProviderProps){
    const [ user, setUser ] = useState<User>({} as User);

    async function signInWithGoogle(){
        try {
            // console.log(CLIENT_ID, REDIRECT_URI);
          const RESPONSE_TYPE= 'token';
          const SCOPE = encodeURI('profile email');

          const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`;
          
          const { params, type } = await AuthSession
          .startAsync({ authUrl }) as AuthorizationResponse;

          if(type === 'success'){
            const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
            const userInfo = await response.json();

            console.log(userInfo);

            setUser({
                id: userInfo.id,
                email: userInfo.email,
                name: userInfo.given_name,
                photo: userInfo.picture
            });
          }
        } catch (error: any) {
            throw new Error(error);
        }
    }

    async function signInWithApple(){
        try {
            const credential = await AppleAuthentication.signInAsync({
                requestedScopes: [
                    AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                    AppleAuthentication.AppleAuthenticationScope.EMAIL
                ]
            });

            if(credential){
                const userLogged = {
                    id: String(credential.user),
                    email: credential.email!,
                    name: credential.fullName!.givenName!,
                    photo: undefined
                }
            }

        } catch (error: any) {
            throw new Error(error);
        }
    }

    return(
        <AuthContext.Provider value={{ 
            user, 
            signInWithGoogle 
        }}>
            { children }
        </AuthContext.Provider>

    );
}

function useAuth(){
    const context = useContext(AuthContext);

    return context;
}

export { AuthProvider, useAuth  }
