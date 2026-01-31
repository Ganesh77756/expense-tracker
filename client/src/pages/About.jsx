const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
      
      
      <h1 className="text-4xl font-bold text-gray-900 mb-6">
        About <span className="text-purple-600">FinSight Tracker</span>
      </h1>

      <p className="text-lg text-gray-600 leading-relaxed mb-10">
        FinSight Tracker is a modern financial management tool designed to help you
        track your income, expenses, and financial goals with ease. Our mission is to 
        empower individuals to take control of their financial lives using smart, simple,
        and easy-to-use tools.
      </p>

      <div className="grid md:grid-cols-3 gap-10 mt-10">
        <div className="p-6 bg-white shadow-md rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">💡 Smart Insights</h3>
          <p className="text-gray-600">
            Understand your spending patterns and track your financial health over time.
          </p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">📊 Real-Time Dashboard</h3>
          <p className="text-gray-600">
            View your financial summary, savings, and expenses in one clean dashboard.
          </p>
        </div>

        <div className="p-6 bg-white shadow-md rounded-xl">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">🔐 Secure & Private</h3>
          <p className="text-gray-600">
            Your financial data is protected with modern encryption and best practices.
          </p>
        </div>
      </div>

    </div>
  );
};

export default About;
