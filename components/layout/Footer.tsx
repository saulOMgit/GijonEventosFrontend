
import React from 'react';
import { GitHubIcon, LinkedInIcon, DocumentTextIcon } from '../icons/Icons';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-800/50">
            <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center">
                    <div className="flex space-x-6">
                         <a href="https://github.com/saulOMgit/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors" aria-label="GitHub">
                            <GitHubIcon className="h-6 w-6" />
                        </a>
                        <a href="https://www.linkedin.com/in/sa%C3%BAl-otero-melchor-84b752282/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors" aria-label="LinkedIn">
                            <LinkedInIcon className="h-6 w-6" />
                        </a>
                        <a href="https://saulcv.netlify.app/" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-400 transition-colors" aria-label="CV">
                            <DocumentTextIcon className="h-6 w-6" />
                        </a>
                    </div>
                    <p className="mt-4 text-center text-sm text-gray-500 dark:text-gray-400">
                        Desarrollado por Saúl Otero Melchor
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;