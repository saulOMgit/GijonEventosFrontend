
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import Button from '../shared/Button';
import { RegisterData } from '../../types';

type Inputs = {
    nombre: string;
    username: string;
    email: string;
    phone: string;
    contrasena: string;
    confirmPassword: string;
};

const RegisterForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors }, watch } = useForm<Inputs>();
    const { register: registerUser, loading, error } = useAuth();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            const registerData: RegisterData = {
                fullName: data.nombre,
                username: data.username,
                email: data.email,
                phone: data.phone,
                password: data.contrasena,
                confirmPassword: data.confirmPassword
            };
            await registerUser(registerData);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
             <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre Completo</label>
                <input
                    id="nombre"
                    type="text"
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 sm:text-sm"
                    placeholder="Nombre"
                />
                {errors.nombre && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.nombre.message}</p>}
            </div>
            <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Nombre de usuario</label>
                <input
                    id="username"
                    type="text"
                    {...register("username", { required: "El nombre de usuario es obligatorio" })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 sm:text-sm"
                    placeholder="Usuario"
                />
                {errors.username && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.username.message}</p>}
            </div>
            <div>
                <label htmlFor="email-reg" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
                <input
                    id="email-reg"
                    type="email"
                    {...register("email", { required: "El email es obligatorio" })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 sm:text-sm"
                    placeholder="usuario@mail.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>}
            </div>
             <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Teléfono</label>
                <input
                    id="phone"
                    type="tel"
                    {...register("phone", { required: "El teléfono es obligatorio" })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 sm:text-sm"
                    placeholder="603121996"
                />
                {errors.phone && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.phone.message}</p>}
            </div>
            <div>
                <label htmlFor="contrasena-reg" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Contraseña</label>
                <input
                    id="contrasena-reg"
                    type="password"
                    {...register("contrasena", { required: "La contraseña es obligatoria", minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 sm:text-sm"
                    placeholder="********"
                />
                {errors.contrasena && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.contrasena.message}</p>}
            </div>
             <div>
                <label htmlFor="confirmPassword-reg" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Repetir Contraseña</label>
                <input
                    id="confirmPassword-reg"
                    type="password"
                    {...register("confirmPassword", { 
                        required: "Por favor, confirma la contraseña",
                        validate: value => value === watch('contrasena') || "Las contraseñas no coinciden"
                    })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 sm:text-sm"
                    placeholder="********"
                />
                {errors.confirmPassword && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.confirmPassword.message}</p>}
            </div>
            {error && <p className="text-sm text-red-600 dark:text-red-400">{error}</p>}
            <Button type="submit" fullWidth loading={loading}>
                Crear Cuenta
            </Button>
        </form>
    );
};

export default RegisterForm;
