export interface LoginFormProps {
    email: string,
    password: string,

    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;

    onSubmit: () => void;
}