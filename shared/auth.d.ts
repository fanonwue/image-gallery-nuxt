// auth.d.ts
declare module '#auth-utils' {
    interface User {
        id: string,
        email: string,
        username: string,
    }

    interface UserSession {
        loggedInAt: Date
    }

    interface SecureSessionData {
        // Add your own fields
    }
}

export {}