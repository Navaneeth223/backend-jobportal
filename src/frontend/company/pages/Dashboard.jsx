import Title from '../components/Title';
import Sections from '../components/Sections';
import Notifications from '../components/Notifications';
import { Building2, Briefcase, FileText, UserCircle } from 'lucide-react';

const Dashboard = () => {
  const icons = {
    Building: Building2,
    Briefcase: Briefcase,
    FileText: FileText,
    User: UserCircle
  };

  return (
    <div className="mx-auto max-w-[1120px]">
      <Title />
      <Sections icons={icons} />
      <Notifications />
    </div>
  );
};

export default Dashboard;
