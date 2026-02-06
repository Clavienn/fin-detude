import React from 'react';
import { Database, Mail, Phone, MapPin, Linkedin, Twitter, Github, Facebook } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

const Footer: React.FC = () => {
  const footerLinks = {
    product: [
      { name: "Fonctionnalités", href: "#features" },
      { name: "Tarifs", href: "#pricing" },
      { name: "Démo", href: "#demo" },
      { name: "Documentation", href: "#docs" }
    ],
    solutions: [
      { name: "Ventes & Commerce", href: "#sales" },
      { name: "Finances", href: "#finance" },
      { name: "Formation", href: "#training" },
      { name: "Ressources Humaines", href: "#hr" }
    ],
    company: [
      { name: "À propos", href: "#about" },
      { name: "Blog", href: "#blog" },
      { name: "Carrières", href: "#careers" },
      { name: "Contact", href: "#contact" }
    ],
    legal: [
      { name: "Politique de confidentialité", href: "#privacy" },
      { name: "Conditions d'utilisation", href: "#terms" },
      { name: "Mentions légales", href: "#legal" },
      { name: "Cookies", href: "#cookies" }
    ]
  };

  const socialLinks = [
    { icon: <Linkedin className="w-5 h-5" />, href: "#", label: "LinkedIn" },
    { icon: <Twitter className="w-5 h-5" />, href: "#", label: "Twitter" },
    { icon: <Github className="w-5 h-5" />, href: "#", label: "GitHub" },
    { icon: <Facebook className="w-5 h-5" />, href: "#", label: "Facebook" }
  ];

  return (
    <footer className="bg-background border-t">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-12 md:py-16">
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Restez informé</h3>
              <p className="text-muted-foreground">
                Recevez les dernières actualités et mises à jour de DataNova
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input 
                type="email" 
                placeholder="Votre adresse email" 
                className="flex-1"
              />
              <Button className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">
                S&apos;abonner
              </Button>
            </div>
          </div>
        </div>

        <Separator />

        {/* Main Footer Content */}
        <div className="py-12 md:py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Brand Column */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                  <Database className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  DataNova
                </span>
              </div>
              <p className="text-sm text-muted-foreground mb-6">
                Plateforme ETL et Data Pipeline automatisé pour l&apos;aide à la décision
              </p>
              <div className="flex space-x-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    aria-label={social.label}
                    className="w-10 h-10 rounded-lg border flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>

            {/* Product Links */}
            <div>
              <h4 className="font-semibold mb-4">Produit</h4>
              <ul className="space-y-3">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions Links */}
            <div>
              <h4 className="font-semibold mb-4">Solutions</h4>
              <ul className="space-y-3">
                {footerLinks.solutions.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h4 className="font-semibold mb-4">Entreprise</h4>
              <ul className="space-y-3">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Links */}
            <div>
              <h4 className="font-semibold mb-4">Légal</h4>
              <ul className="space-y-3">
                {footerLinks.legal.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <Separator />

        {/* Contact & Copyright */}
        <div className="py-8">
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <Mail className="w-4 h-4 text-muted-foreground" />
                <a href="mailto:contact@datanova.com" className="hover:text-cyan-500 transition">
                  contact@datanova.com
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Phone className="w-4 h-4 text-muted-foreground" />
                <a href="tel:+261000000000" className="hover:text-cyan-500 transition">
                  +261 00 000 00 00
                </a>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <span className="text-muted-foreground">
                  Antananarivo, Madagascar
                </span>
              </div>
            </div>

            {/* Stack Badge */}
            <div className="flex items-center justify-start md:justify-end">
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-accent rounded-lg">
                <span className="text-sm font-medium">Propulsé par</span>
                <span className="text-sm font-bold bg-gradient-to-r from-cyan-400 to-blue-600 bg-clip-text text-transparent">
                  MENN + FastAPI
                </span>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} DataNova. Tous droits réservés.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;