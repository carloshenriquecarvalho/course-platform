import { LoginFormProps } from "../types"

export default function LoginForm({email, password, onEmailChange, onPasswordChange, onSubmit} : LoginFormProps) {
    return (
        <>
            <form
                className="bg-white w-75 flex flex-col items-center shadow-xl rounded p-4 gap-5   " 
                onSubmit={(e) =>{
                e.preventDefault(); 
                onSubmit();}}>
                <div className="flex text-center">
                    <h1 
                        className="text-2xl font-bold">
                        Faça login para acessar suas aulas</h1>
                </div>
                <div 
                    className=" flex flex-col items-start w-full gap-2">
                    <label htmlFor="email" >Digie seu email:</label>
                    <input 
                        className="border w-full"
                        value={email} onChange={(e) => onEmailChange(e.target.value)} type="email" />

                    <label htmlFor="password">Digite sua senha:</label>
                    <input
                        className="border w-full" 
                        value={password} onChange={(e) => onPasswordChange(e.target.value)} type="password" />

                    <button 
                        className="bg-amber-500 py-1 px-2 w-full cursor-pointer rounded font-semibold hover:bg-amber-400 duration-400" 
                        type="submit">Entrar
                    </button>
                </div>
            </form>
        </>
    )
}