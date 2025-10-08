
import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useAuth } from '../../hooks/useAuth';
import Button from '../shared/Button';

type Inputs = {
    nombre: string;
    email: string;
    contrasena: string;
};

const RegisterForm: React.FC = () => {
    const { register, handleSubmit, formState: { errors } } = useForm<Inputs>();
    const { register: registerUser, loading, error } = useAuth();

    const onSubmit: SubmitHandler<Inputs> = async (data) => {
        try {
            await registerUser(data.nombre, data.email, data.contrasena);
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
             <div>
                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">Nombre Completo</label>
                <input
                    id="nombre"
                    type="text"
                    {...register("nombre", { required: "El nombre es obligatorio" })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="Tu Nombre"
                />
                {errors.nombre && <p className="mt-1 text-sm text-red-600">{errors.nombre.message}</p>}
            </div>
            <div>
                <label htmlFor="email-reg" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                    id="email-reg"
                    type="email"
                    {...register("email", { required: "El email es obligatorio" })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="tu@email.com"
                />
                {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
            </div>
            <div>
                <label htmlFor="contrasena-reg" className="block text-sm font-medium text-gray-700">Contraseña</label>
                <input
                    id="contrasena-reg"
                    type="password"
                    {...register("contrasena", { required: "La contraseña es obligatoria", minLength: { value: 6, message: 'Mínimo 6 caracteres' } })}
                    className="mt-1 block w-full px-3 py-2 bg-gray-50 text-gray-900 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                    placeholder="********"
                />
                {errors.contrasena && <p className="mt-1 text-sm text-red-600">{errors.contrasena.message}</p>}
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" fullWidth loading={loading}>
                Crear Cuenta
            </Button>
        </form>
    );
};

export default RegisterForm;
