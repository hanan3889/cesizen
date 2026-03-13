import { Link } from 'react-router-dom';

const Footer = () => (
    <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
                © {new Date().getFullYear()} CesiZen — Ministère de la Santé et de la Prévention
            </p>
            <Link to="/privacy" className="text-sm text-gray-500 hover:text-cesizen-green transition">
                Politique de confidentialité
            </Link>
        </div>
    </footer>
);

export default Footer;
