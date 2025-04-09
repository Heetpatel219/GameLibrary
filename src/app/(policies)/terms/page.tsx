import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-grow py-12 px-4 md:px-8 max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-blue-500">
          Terms of Service
        </h1>
        
        <div className="bg-gray-900 rounded-xl p-6 md:p-8 shadow-lg">
          <p className="text-sm text-gray-400 mb-6">Last Updated: March 21, 2025</p>
          
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-3 text-blue-400">1. Introduction</h2>
            <p className="text-gray-300 mb-3">
              Welcome to 404 Gamers. These Terms of Service govern your use of our website. 
            </p>
            <p className="text-gray-300">
              This is an educational project created by Adi, Aubrey, and Heet for WEB 422 at Seneca College. By accessing our website, you agree to these terms.
            </p>
          </section>
         
          
          <section>
            <h2 className="text-xl font-semibold mb-3 text-blue-400">2. Contact Information</h2>
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