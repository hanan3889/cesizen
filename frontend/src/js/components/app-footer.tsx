import TextLink from '@/components/text-link';

export function AppFooter() {
    return (
        <footer className="border-t !bg-black text-gray-300">
            <div className="container mx-auto flex max-w-screen-xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                <div className="text-sm">
                    &copy; {new Date().getFullYear()} Cesizen. Tous droits réservés.
                </div>
                <div className="flex items-center space-x-4">
                    <TextLink href="#" className="text-white !no-underline hover:text-gray-200">
                        Termes et conditions
                    </TextLink>
                    <TextLink href="#" className="text-white !no-underline hover:text-gray-200">
                        Politique de confidentialité
                    </TextLink>
                </div>
            </div>
        </footer>
    );
}
