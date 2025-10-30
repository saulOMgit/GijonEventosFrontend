import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import Button from '../shared/Button';

type Inputs = {
    username: string;
    contrasena: string;
};

const LoginForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const { login, loading, error } = useAuth();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            await login(data.username, data.contrasena);
        } catch (err) {
            // Error is handled in the auth hook and displayed
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de usuario</label>
                <input
                    id="username"
                    type="text"
                    {...register("username", { required: "El nombre de usuario es obligatorio" })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 sm:text-sm"
                    placeholder="tu usuario"
                />
                {errors.username && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username.message}</p>}
            </div>
            <div>
                <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                <input
                    id="contrasena"
                    type="password"
                    {...register("contrasena", { required: "La contraseña es obligatoria" })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 sm:text-sm"
                    placeholder="********"
                />
                {errors.contrasena && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contrasena.message}</p>}
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <Button type="submit" fullWidth loading={loading}>
                Iniciar Sesión
            </Button>
        </form>
    );
};

export default LoginForm;