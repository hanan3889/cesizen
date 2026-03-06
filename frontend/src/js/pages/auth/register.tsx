import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
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
import AppLogo from '@/components/app-logo';
import { 
    Check, 
    X, 
    Eye, 
    EyeOff, 
    Mail, 
    Lock, 
    User, 
    Calendar 
} from 'lucide-react';
import { register as registerRoute, login as loginRoute } from '@/routes';

// ============================================================================
// TYPES
// ============================================================================

interface ValidationState {
    nom: boolean | null;
    prenom: boolean | null;
    email: boolean | null;
    dateNaissance: boolean | null;
    password: boolean | null;
    password_confirmation: boolean | null;
}

interface PasswordStrength {
    strength: number;
    label: string;
    color: string;
}

// ============================================================================
// COMPOSANT REGISTER
// ============================================================================

export default function Register() {
    // Inertia.js Form
    const { data, setData, post, processing, errors } = useForm({
        nom: '',
        prenom: '',
        email: '',
        dateNaissance: '',
        password: '',
        password_confirmation: '',
        acceptRGPD: false,
    });

    // States locaux
    const [validation, setValidation] = useState<ValidationState>({
        nom: null,
        prenom: null,
        email: null,
        dateNaissance: null,
        password: null,
        password_confirmation: null,
    });
    
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

    // ============================================================================
    // FONCTIONS DE VALIDATION
    // ============================================================================

    const validateField = (field: keyof ValidationState, value: string): boolean => {
        switch(field) {
            case 'nom':
            case 'prenom':
                return value.length >= 2 && /^[a-zA-ZÀ-ÿ\s-]+$/.test(value);
            
            case 'email':
                return /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
            
            case 'dateNaissance':
                if (!value) return false;
                const birthDate = new Date(value);
                const today = new Date();
                const age = today.getFullYear() - birthDate.getFullYear();
                return age >= 13 && age <= 120;
            
            case 'password':
                return value.length >= 8 && 
                       /[A-Z]/.test(value) && 
                       /[a-z]/.test(value) && 
                       /[0-9]/.test(value) && 
                       /[!@#$%^&*(),.?":{}|<>]/.test(value);
            
            case 'password_confirmation':
                return value === data.password && value.length > 0;
            
            default:
                return true;
        }
    };

    const handleInputChange = (field: keyof typeof data, value: string) => {
        setData(field, value);
        
        if (value.length > 0 && field in validation) {
            setValidation(prev => ({ 
                ...prev, 
                [field]: validateField(field as keyof ValidationState, value) 
            }));
        } else if (field in validation) {
            setValidation(prev => ({ ...prev, [field]: null }));
        }
    };

    const getPasswordStrength = (): PasswordStrength => {
        const password = data.password;
        if (!password) return { strength: 0, label: '', color: '' };
        
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        
        const labels = ['', 'Faible', 'Moyen', 'Fort', 'Très fort', 'Excellent'];
        const colors = ['', 'rgb(239, 68, 68)', 'rgb(251, 146, 60)', 'rgb(250, 204, 21)', 'rgb(34, 197, 94)', 'rgb(22, 163, 74)'];
        
        return { 
            strength: (strength / 5) * 100, 
            label: labels[strength], 
            color: colors[strength] 
        };
    };

    // Revalider la confirmation quand le mot de passe change
    useEffect(() => {
        if (data.password_confirmation.length > 0) {
            setValidation(prev => ({
                ...prev,
                password_confirmation: validateField('password_confirmation', data.password_confirmation)
            }));
        }
    }, [data.password]);

    const passwordStrength = getPasswordStrength();

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post(registerRoute.url());
    };

    // ============================================================================
    // RENDER
    // ============================================================================

    return (
        <AuthLayout>
            <Head title='Inscription - CesiZen' />
            
            {/* Éléments décoratifs flottants */}
            <div className="fixed inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full bg-green-500/5 animate-float" />
                <div className="absolute bottom-[-150px] left-[-150px] w-[400px] h-[400px] rounded-full bg-yellow-400/5 animate-float-reverse" />
            </div>

            <Card className="mx-auto max-w-2xl backdrop-blur-sm bg-white/95 shadow-2xl border-green-100 relative z-10">
                <CardHeader className="text-center space-y-4">
                    {/* Logo */}
                    <div className="flex items-center justify-center gap-3 mb-2">
                        <AppLogo />
                    </div>
                    
                    <CardTitle className="text-2xl">Créer votre espace bien-être</CardTitle>
                    <CardDescription>
                        Rejoignez-nous pour prendre soin de votre santé mentale
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        {/* Nom et Prénom */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {/* Nom */}
                            <div className="space-y-2">
                                <Label htmlFor="nom">Nom *</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="nom"
                                        name="nom"
                                        value={data.nom}
                                        onChange={(e) => handleInputChange('nom', e.target.value)}
                                        className={`pl-10 ${
                                            validation.nom === false ? 'border-red-500 focus:ring-red-500' :
                                            validation.nom === true ? 'border-green-500 focus:ring-green-500' : ''
                                        }`}
                                        required
                                    />
                                    {validation.nom === true && (
                                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                                    )}
                                    {validation.nom === false && (
                                        <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                                    )}
                                </div>
                                {errors.nom && <p className="text-xs text-red-500">{errors.nom}</p>}
                            </div>

                            {/* Prénom */}
                            <div className="space-y-2">
                                <Label htmlFor="prenom">Prénom *</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="prenom"
                                        name="prenom"
                                        value={data.prenom}
                                        onChange={(e) => handleInputChange('prenom', e.target.value)}
                                        className={`pl-10 ${
                                            validation.prenom === false ? 'border-red-500 focus:ring-red-500' :
                                            validation.prenom === true ? 'border-green-500 focus:ring-green-500' : ''
                                        }`}
                                        required
                                    />
                                    {validation.prenom === true && (
                                        <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                                    )}
                                    {validation.prenom === false && (
                                        <X className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-red-500" />
                                    )}
                                </div>
                                {errors.prenom && <p className="text-xs text-red-500">{errors.prenom}</p>}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <Label htmlFor="email">Email *</Label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    value={data.email}
                                    autoComplete="username"
                                    onChange={(e) => handleInputChange('email', e.target.value)}
                                    className={`pl-10 ${
                                        validation.email === false ? 'border-red-500 focus:ring-red-500' :
                                        validation.email === true ? 'border-green-500 focus:ring-green-500' : ''
                                    }`}
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

                        {/* Date de naissance */}
                        <div className="space-y-2">
                            <Label htmlFor="dateNaissance">Date de naissance *</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="dateNaissance"
                                    type="date"
                                    name="dateNaissance"
                                    value={data.dateNaissance}
                                    max={new Date(new Date().setFullYear(new Date().getFullYear() - 13)).toISOString().split('T')[0]}
                                    onChange={(e) => handleInputChange('dateNaissance', e.target.value)}
                                    className={`pl-10 ${
                                        validation.dateNaissance === false ? 'border-red-500 focus:ring-red-500' :
                                        validation.dateNaissance === true ? 'border-green-500 focus:ring-green-500' : ''
                                    }`}
                                    required
                                />
                                {validation.dateNaissance === true && (
                                    <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
                                )}
                            </div>
                            {errors.dateNaissance && <p className="text-xs text-red-500">{errors.dateNaissance}</p>}
                            <p className="text-xs text-gray-500">Vous devez avoir au moins 13 ans</p>
                        </div>

                        {/* Mot de passe */}
                        <div className="space-y-2">
                            <Label htmlFor="password">Mot de passe *</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    name="password"
                                    value={data.password}
                                    autoComplete="new-password"
                                    onChange={(e) => handleInputChange('password', e.target.value)}
                                    className={`pl-10 pr-10 ${
                                        validation.password === false ? 'border-red-500 focus:ring-red-500' :
                                        validation.password === true ? 'border-green-500 focus:ring-green-500' : ''
                                    }`}
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
                            
                            {/* Indicateur de force du mot de passe */}
                            {data.password && (
                                <div className="space-y-2 mt-3">
                                    <div className="flex justify-between items-center text-xs">
                                        <span className="text-gray-600">Force du mot de passe</span>
                                        <span className="font-semibold" style={{ color: passwordStrength.color }}>
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div 
                                            className="h-full transition-all duration-300 rounded-full"
                                            style={{ 
                                                width: `${passwordStrength.strength}%`,
                                                backgroundColor: passwordStrength.color
                                            }}
                                        />
                                    </div>
                                    <ul className="space-y-1 text-xs">
                                        <li className={data.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}>
                                            ✓ Au moins 8 caractères
                                        </li>
                                        <li className={/[A-Z]/.test(data.password) && /[a-z]/.test(data.password) ? 'text-green-600' : 'text-gray-500'}>
                                            ✓ Majuscules et minuscules
                                        </li>
                                        <li className={/[0-9]/.test(data.password) ? 'text-green-600' : 'text-gray-500'}>
                                            ✓ Au moins un chiffre
                                        </li>
                                        <li className={/[!@#$%^&*(),.?":{}|<>]/.test(data.password) ? 'text-green-600' : 'text-gray-500'}>
                                            ✓ Au moins un caractère spécial
                                        </li>
                                    </ul>
                                </div>
                            )}
                            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
                        </div>

                        {/* Confirmation mot de passe */}
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirmer le mot de passe *</Label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    id="password_confirmation"
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    name="password_confirmation"
                                    value={data.password_confirmation}
                                    autoComplete="new-password"
                                    onChange={(e) => handleInputChange('password_confirmation', e.target.value)}
                                    className={`pl-10 pr-10 ${
                                        validation.password_confirmation === false ? 'border-red-500 focus:ring-red-500' :
                                        validation.password_confirmation === true ? 'border-green-500 focus:ring-green-500' : ''
                                    }`}
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                            {errors.password_confirmation && <p className="text-xs text-red-500">{errors.password_confirmation}</p>}
                        </div>

                        {/* RGPD */}
                        <div className="space-y-2">
                            <div className={`flex items-start space-x-3 p-4 rounded-lg bg-gray-50 border-2 ${
                                errors.acceptRGPD ? 'border-red-500' : 'border-transparent'
                            }`}>
                                <Checkbox
                                    id="acceptRGPD"
                                    checked={data.acceptRGPD}
                                    onCheckedChange={(checked) => setData('acceptRGPD', checked as boolean)}
                                    className="mt-0.5"
                                />
                                <label 
                                    htmlFor="acceptRGPD" 
                                    className="text-sm text-gray-600 leading-relaxed cursor-pointer"
                                >
                                    J'accepte la{' '}
                                    <Link href="/privacy" className="text-green-600 font-semibold hover:underline">
                                        politique de confidentialité
                                    </Link>
                                    {' '}et le traitement de mes données personnelles conformément au RGPD. *
                                </label>
                            </div>
                            {errors.acceptRGPD && <p className="text-xs text-red-500">{errors.acceptRGPD}</p>}
                        </div>

                        {/* Bouton Submit */}
                        <Button 
                            type="submit" 
                            className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-0.5" 
                            disabled={processing}
                            size="lg"
                        >
                            {processing ? 'Création en cours...' : 'Créer mon compte'}
                        </Button>

                        {/* Lien vers connexion */}
                        <div className="text-center text-sm text-gray-600">
                            Déjà inscrit ?{' '}
                            <Link 
                                href={loginRoute.url()} 
                                className="text-green-600 font-semibold hover:underline"
                            >
                                Se connecter
                            </Link>
                        </div>
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
