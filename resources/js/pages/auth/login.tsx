import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import AuthLayout from '@/layouts/auth-layout';
import { login, register } from '@/routes';
import { 
    Mail, 
    Lock, 
    Eye, 
    EyeOff,
    Check,
    X
} from 'lucide-react';

// ============================================================================
// TYPES
// ============================================================================

interface LoginProps {
    status?: string;
    canResetPassword: boolean;
    canRegister: boolean;
}

interface ValidationState {
    email: boolean | null;
    password: boolean | null;
}

// ============================================================================
// COMPOSANT LOGIN
// ============================================================================

export default function Login({
    status,
    canResetPassword,
    canRegister,
}: LoginProps) {
    // Inertia.js Form
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // States locaux
    const [validation, setValidation] = useState<ValidationState>({
        email: null,
        password: null,
    });
    
    const [showPassword, setShowPassword] = useState<boolean>(false);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    // ============================================================================
    // FONCTIONS DE VALIDATION
    // ============================================================================

    const validateField = (field: keyof ValidationState, value: string): boolean => {
        switch(field) {
            case 'email':
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
            
            case 'password':
                return value.length >= 8;
            
            default:
                return true;
        }
    };

    const handleInputChange = (field: keyof typeof data, value: string | boolean) => {
        setData(field, value);
        
        if (typeof value === 'string' && value.length > 0 && field in validation) {
            setValidation(prev => ({ 
                ...prev, 
                [field]: validateField(field as keyof ValidationState, value) 
            }));
        } else if (typeof value === 'string' && field in validation) {
            setValidation(prev => ({ ...prev, [field]: null }));
        }
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(login.url());
    };

    // ============================================================================
    // RENDER
    // ============================================================================

    return (
        <AuthLayout>
            <Head title='Connexion - CesiZen' />
            
            {/* Éléments décoratifs flottants */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-green-500/5 animate-float" />
                <div className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full bg-yellow-400/5 animate-float-reverse" />
            </div>

            <Card className="mx-auto max-w-md backdrop-blur-sm bg-white/95 shadow-2xl border-green-100 relative z-10">
                <CardHeader className="text-center space-y-4">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-500 to-green-400 flex items-center justify-center shadow-lg">
                            <span className="text-2xl">🧘</span>
                        </div>
                        <h1 className="text-4xl font-serif font-bold bg-gradient-to-r from-green-700 to-green-500 bg-clip-text text-transparent">
                            CesiZen
                        </h1>
                    </div>
                    
                    <CardTitle className="text-2xl">Connexion à votre compte</CardTitle>
                    <CardDescription>
                        Entrez vos identifiants pour accéder à votre espace
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    {/* Message de statut (succès) */}
                    {status && (
                        <div className="mb-6 p-4 rounded-lg bg-green-50 border border-green-200">
                            <p className="text-sm text-green-800 text-center font-medium">
                                {status}
                            </p>
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-4">
                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Adresse email *</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="email"
                                    autoFocus
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`pl-10 ${
                                        validation.email === false ? 'border-red-500 focus:ring-red-500' :
                                        validation.email === true ? 'border-green-500 focus:ring-green-500' : ''
                                    }`}
                                    placeholder="votre@email.com"
                                    required
                                />
                                {validation.email === true && (
                                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                                )}
                                {validation.email === false && (
                                    <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                                )}
                            </div>
                            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
                        </div>

                        {/* Mot de passe */}
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Mot de passe *</Label>
                                {canResetPassword && (
                                    <Link 
                                        href="/forgot-password" 
                                        className="text-xs text-green-600 hover:text-green-700 hover:underline"
                                    >
                                        Mot de passe oublié ?
                                    </Link>
                                )}
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    autoComplete="current-password"
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`pl-10 pr-10 ${
                                        validation.password === false ? 'border-red-500 focus:ring-red-500' :
                                        validation.password === true ? 'border-green-500 focus:ring-green-500' : ''
                                    }`}
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                        </div>

                        {/* Se souvenir de moi */}
                        <div className="flex items-start space-x-3 pt-2">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) => handleInputChange('remember', !!checked)}
                                className="mt-0.5"
                            />
                            <label 
                                htmlFor="remember" 
                                className="text-sm text-gray-600 leading-relaxed cursor-pointer"
                            >
                                Se souvenir de moi sur cet appareil
                            </label>
                        </div>

                        {/* Bouton Submit */}
                        <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" 
                            disabled={processing}
                            size="lg"
                        >
                            {processing ? 'Connexion en cours...' : 'Se connecter'}
                        </Button>

                        {/* Lien vers inscription */}
                        {canRegister && (
                            <div className="text-center text-sm text-gray-600 pt-2">
                                Pas encore de compte ?{' '}
                                <Link 
                                    href={register.url()} 
                                    className="text-green-600 font-semibold hover:underline"
                                >
                                    S'inscrire
                                </Link>
                            </div>
                        )}
                    </form>
                </CardContent>
            </Card>

            {/* Styles pour les animations */}
            <style jsx global>{`
                @keyframes float {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    50% {
                        transform: translate(20px, 20px) scale(1.1);
                    }
                }
                
                @keyframes float-reverse {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                    }
                    50% {
                        transform: translate(-20px, -20px) scale(1.1);
                    }
                }
                
                .animate-float {
                    animation: float 8s ease-in-out infinite;
                }
                
                .animate-float-reverse {
                    animation: float-reverse 10s ease-in-out infinite;
                }
            `}</style>
        </AuthLayout>
    );
}
