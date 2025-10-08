
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import Button from '../shared/Button';

type Inputs = {
    email: string;
    contrasena: string;
};

const LoginForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const { login, loading, error } = useAuth();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            await login(data.email, data.contrasena);
        } catch (err) {
            // Error is handled in the auth hook and displayed
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    id="email"
                    type="email"
                    defaultValue="admin@email.com"
                    {...register("email", { required: "El email es obligatorio" })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="tu@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
                <label htmlFor="contrasena" className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                    id="contrasena"
                    type="password"
                    defaultValue="password123"
                    {...register("contrasena", { required: "La contraseña es obligatoria" })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="********"
                />
                {errors.contrasena && <p className="mt-1 text-sm text-red-600">{errors.contrasena.message}</p>}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" fullWidth loading={loading}>
                Iniciar Sesión
            </Button>
        </form>
    );
};

export default LoginForm;
