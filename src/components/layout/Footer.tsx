// src/components/layout/Footer.tsx

export const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-4 px-6">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <p className="text-sm">© 2024 BattleVision. All rights reserved.</p>
        </div>
        <div className="flex gap-4 text-sm">
          <a href="#" className="hover:text-white">Documentation</a>
          <a href="#" className="hover:text-white">Support</a>
          <a href="#" className="hover:text-white">Privacy Policy</a>
        </div>
      </div>
    </footer>
  );
};