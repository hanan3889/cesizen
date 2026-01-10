import React from 'react';
import { Head } from '@inertiajs/react';

const ArticleCard = ({ title, children }) => (
    <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 h-full">
        <h3 className="text-xl font-semibold text-gray-900 mb-3">{title}</h3>
        <p className="text-gray-600">{children}</p>
    </div>
);

const Informations = () => {
    const articles = [
        {
            title: "Respirez, vous êtes au contrôle",
            content: "Pratiquez la respiration carrée : inspirez pendant 4s, retenez 4s, expirez 4s, et attendez 4s. Cet exercice simple peut calmer votre système nerveux instantanément."
        },
        {
            title: "L'importance d'une routine saine",
            content: "Un sommeil régulier, une alimentation équilibrée et une activité physique modérée sont les piliers de la santé mentale. Essayez de fixer des heures de coucher et de lever constantes, même le week-end."
        },
        {
            title: "Connectez-vous au moment présent",
            content: "La pleine conscience (mindfulness) vous aide à vous détacher des pensées anxieuses. Prenez 5 minutes pour vous concentrer sur vos sensations : les sons autour de vous, l'air sur votre peau, vos pieds sur le sol."
        },
        {
            title: "La technique Pomodoro pour la concentration",
            content: "Pour éviter le surmenage, travaillez par intervalles. 25 minutes de travail concentré suivies de 5 minutes de pause. Après 4 cycles, prenez une pause plus longue de 15-30 minutes. Cela préserve votre énergie mentale."
        },
        {
            title: "Les bienfaits de l'écriture (Journaling)",
            content: "Prendre quelques minutes chaque jour pour écrire vos pensées et sentiments peut vous aider à clarifier vos idées, à réduire le stress et à mieux vous comprendre. Il n'y a pas de bonne ou de mauvaise façon de le faire."
        },
        {
            title: "Reconnaître les signes du burnout",
            content: "Le burnout se caractérise par un épuisement émotionnel, une dépersonnalisation et un sentiment de faible accomplissement personnel. Si vous vous sentez constamment cynique et détaché, il est peut-être temps de demander de l'aide."
        }
    ];

    return (
        <>
            <Head title="Informations" />
            <div className="bg-gray-50 py-12 min-h-screen">
                <div className="container mx-auto px-4">
                    <h1 className="text-4xl font-bold text-center text-gray-900 mb-4">
                        Informations et Conseils
                    </h1>
                    <p className="text-lg text-center text-gray-600 mb-12">
                        Ressources pour cultiver votre bien-être mental et gérer le stress au quotidien.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {articles.map((article, index) => (
                            <ArticleCard key={index} title={article.title}>
                                {article.content}
                            </ArticleCard>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default Informations;
