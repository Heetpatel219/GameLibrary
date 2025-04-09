import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow py-12 px-4 md:px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          Privacy Policy
        </h1>
        
        <div className="bg-gray-900 rounded-xl p-6 md:p-8 shadow-lg">
          <p className="text-sm text-gray-400 mb-6">Last Updated: March 21, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-blue-400">1. Introduction</h2>
            <p className="text-gray-300 mb-3">
              Welcome to 404 Gamers. This project is created by Adi, Aubrey, and Heet for WEB 422 at Seneca College.
            </p>
          </section>
        
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-blue-400">2. Educational Purpose</h2>
            <p className="text-gray-300 mb-3">
              This website was developed as part of a course project to demonstrate skills in:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Web application development</li>
              <li>User interface design</li>
              <li>Frontend frameworks</li>
              <li>Responsive design principles</li>
              <li>Modern web development practices</li>
            </ul>
          </section>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-blue-400">3. Third-Party Resources</h2>
            <p className="text-gray-300 mb-3">
              This project may use third-party resources such as:
            </p>
            <ul className="list-disc pl-6 text-gray-300 space-y-2">
              <li>Fonts from Google Fonts</li>
              <li>Icons from open source libraries</li>
              <li>Stock images for demonstration purposes</li>
              <li>External CSS frameworks</li>
            </ul>
            <p className="text-gray-300">
              These resources may have their own privacy policies and terms of service.
            </p>
          </section>
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-400">5. Contact Information</h2>
            <p className="text-gray-300 mb-3">
              This project was created by:
            </p>
            <div className="bg-gray-800 rounded-lg p-4">
              <p className="text-gray-300">Adi Tambe</p>
              <p className="text-gray-300">Aubrey Du</p>
              <p className="text-gray-300">Heet Patel</p>
              <p className="text-gray-400 mt-3">WEB 422 - Client-Side Development</p>
              <p className="text-gray-400">Seneca College, 2025</p>
            </div>
          </section>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}