import dashboard from '../assets/dashboardpic.jpg';

function Dashboard() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      {/* <p className="mb-4 text-lg font-semibold">This is a page for dashboard</p> */}
      <img 
        src={dashboard} 
        alt="Dashboard visual" 
        className="rounded shadow-md"
      />
    </div>
  );
}

export default Dashboard;
