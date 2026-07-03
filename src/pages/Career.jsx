// src/pages/Career.jsx
import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  GraduationCap,
  Code,
  Palette,
  TrendingUp,
  Award,
  Star,
  Target,
  BookOpen,
  Users,
  Zap,
  CheckCircle,
  Clock,
  MapPin,
  Mail,
  Phone,
  Calendar,
  Github,
  Linkedin,
  Twitter,
  Globe,
  FileText,
  Settings,
  ChevronRight,
  Shield,
  Brain,
  Heart,
  Sparkles,
  X,
  ChevronDown,
  ChevronUp,
  Loader,
  AlertCircle,
  Plus,
  Trash2,
  Edit2,
  Save,
  RefreshCw,
  Crown,
  Gem,
  Medal,
  Trophy,
  Rocket,
  Star as StarIcon,
  Award as AwardIcon,
  BarChart3,
  Activity,
  Eye,
  EyeOff,
  Share2,
  Bookmark,
  Flag,
  MoreVertical,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Moon,
  Sun,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import Button from '../components/common/Button';
import Input from '../components/common/Input';
import { toast } from 'react-toastify';

// ============================================
// HELPER FUNCTIONS (defined outside components)
// ============================================

const getRankIcon = (rank) => {
  const icons = {
    'E': Shield,
    'D': StarIcon,
    'C': Gem,
    'B': Crown,
    'A': Medal,
    'S': Trophy,
    'SS': AwardIcon,
    'Mythic': Sparkles,
  };
  return icons[rank] || Shield;
};

const getRankColor = (rank) => {
  const colors = {
    'E': 'text-gray-400',
    'D': 'text-blue-400',
    'C': 'text-green-400',
    'B': 'text-yellow-400',
    'A': 'text-orange-400',
    'S': 'text-red-400',
    'SS': 'text-purple-400',
    'Mythic': 'text-pink-400',
  };
  return colors[rank] || 'text-gray-400';
};

const getRankBgColor = (rank) => {
  const colors = {
    'E': 'bg-gray-400/20',
    'D': 'bg-blue-400/20',
    'C': 'bg-green-400/20',
    'B': 'bg-yellow-400/20',
    'A': 'bg-orange-400/20',
    'S': 'bg-red-400/20',
    'SS': 'bg-purple-400/20',
    'Mythic': 'bg-pink-400/20',
  };
  return colors[rank] || 'bg-gray-400/20';
};

const Career = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const { profile } = useSelector(state => state.user);
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCareer, setSelectedCareer] = useState('developer');
  const [showCareerSwitch, setShowCareerSwitch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [showSkillDetail, setShowSkillDetail] = useState(false);

  // Career data
  const careers = [
    { 
      id: 'developer', 
      name: 'Developer', 
      icon: Code, 
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-500/10',
      textColor: 'text-blue-400',
      borderColor: 'border-blue-500/20',
      description: 'Build software and create digital solutions',
      progress: 75,
      level: 8,
      xp: 4250,
      rank: 'B',
    },
    { 
      id: 'designer', 
      name: 'Designer', 
      icon: Palette, 
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-500/10',
      textColor: 'text-purple-400',
      borderColor: 'border-purple-500/20',
      description: 'Create beautiful and intuitive designs',
      progress: 45,
      level: 5,
      xp: 2150,
      rank: 'C',
    },
    { 
      id: 'business', 
      name: 'Business', 
      icon: Briefcase, 
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-500/10',
      textColor: 'text-green-400',
      borderColor: 'border-green-500/20',
      description: 'Build and grow successful businesses',
      progress: 30,
      level: 3,
      xp: 1250,
      rank: 'D',
    },
    { 
      id: 'student', 
      name: 'Student', 
      icon: GraduationCap, 
      color: 'from-yellow-500 to-orange-500',
      bgColor: 'bg-yellow-500/10',
      textColor: 'text-yellow-400',
      borderColor: 'border-yellow-500/20',
      description: 'Learn and excel in academics',
      progress: 60,
      level: 6,
      xp: 3200,
      rank: 'C',
    },
    { 
      id: 'fitness', 
      name: 'Fitness', 
      icon: Heart, 
      color: 'from-red-500 to-pink-500',
      bgColor: 'bg-red-500/10',
      textColor: 'text-red-400',
      borderColor: 'border-red-500/20',
      description: 'Achieve peak physical health',
      progress: 20,
      level: 2,
      xp: 850,
      rank: 'D',
    },
    { 
      id: 'creator', 
      name: 'Creator', 
      icon: Sparkles, 
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-500/10',
      textColor: 'text-pink-400',
      borderColor: 'border-pink-500/20',
      description: 'Create content and build an audience',
      progress: 35,
      level: 4,
      xp: 1800,
      rank: 'D',
    },
  ];

  // Skills data per career
  const skillsData = {
    developer: [
      { name: 'JavaScript', level: 85, icon: 'JS', description: 'Modern JavaScript with ES6+', xp: 1250, color: '#f7df1e' },
      { name: 'React', level: 80, icon: '⚛️', description: 'Building modern UIs with React', xp: 980, color: '#61dafb' },
      { name: 'Node.js', level: 70, icon: '🟢', description: 'Server-side JavaScript runtime', xp: 750, color: '#68a063' },
      { name: 'Python', level: 65, icon: '🐍', description: 'Versatile programming language', xp: 620, color: '#3776ab' },
      { name: 'SQL', level: 75, icon: '📊', description: 'Database query language', xp: 890, color: '#00758f' },
      { name: 'Git', level: 90, icon: '🔀', description: 'Version control system', xp: 1450, color: '#f05032' },
    ],
    designer: [
      { name: 'UI/UX Design', level: 85, icon: '🎨', description: 'User interface and experience design', xp: 1200, color: '#7d26ff' },
      { name: 'Figma', level: 80, icon: '📐', description: 'Design and prototyping tool', xp: 950, color: '#00d4a0' },
      { name: 'Adobe XD', level: 70, icon: '🎭', description: 'UI/UX design tool', xp: 720, color: '#ff61f6' },
      { name: 'Typography', level: 75, icon: '🔤', description: 'Font and typeface design', xp: 860, color: '#4a4a4a' },
      { name: 'Color Theory', level: 85, icon: '🎨', description: 'Understanding color psychology', xp: 1100, color: '#ff6b6b' },
    ],
    business: [
      { name: 'Leadership', level: 70, icon: '👥', description: 'Leading teams effectively', xp: 680, color: '#4a9eff' },
      { name: 'Strategy', level: 65, icon: '📈', description: 'Strategic planning and execution', xp: 550, color: '#ffd93d' },
      { name: 'Finance', level: 60, icon: '💰', description: 'Financial management', xp: 480, color: '#6bcb77' },
      { name: 'Marketing', level: 55, icon: '📣', description: 'Marketing strategies', xp: 420, color: '#ff6b6b' },
      { name: 'Operations', level: 50, icon: '⚙️', description: 'Operational management', xp: 350, color: '#4d4d4d' },
    ],
    student: [
      { name: 'Mathematics', level: 80, icon: '📐', description: 'Mathematical concepts and problems', xp: 980, color: '#ff6b6b' },
      { name: 'Science', level: 75, icon: '🔬', description: 'Scientific principles', xp: 850, color: '#4a9eff' },
      { name: 'English', level: 85, icon: '📚', description: 'Language and literature', xp: 1100, color: '#ffd93d' },
      { name: 'History', level: 70, icon: '📜', description: 'Historical events and analysis', xp: 650, color: '#6bcb77' },
      { name: 'Research', level: 65, icon: '🔍', description: 'Research methods', xp: 580, color: '#7d26ff' },
    ],
    fitness: [
      { name: 'Strength', level: 70, icon: '💪', description: 'Strength training and building', xp: 720, color: '#ff6b6b' },
      { name: 'Cardio', level: 75, icon: '🏃', description: 'Cardiovascular fitness', xp: 850, color: '#4a9eff' },
      { name: 'Flexibility', level: 60, icon: '🧘', description: 'Stretching and mobility', xp: 480, color: '#6bcb77' },
      { name: 'Nutrition', level: 55, icon: '🥗', description: 'Diet and nutrition', xp: 420, color: '#ffd93d' },
      { name: 'Recovery', level: 65, icon: '💤', description: 'Rest and recovery', xp: 580, color: '#7d26ff' },
    ],
    creator: [
      { name: 'Content Creation', level: 75, icon: '📹', description: 'Creating engaging content', xp: 820, color: '#ff6b6b' },
      { name: 'Photography', level: 70, icon: '📷', description: 'Photography techniques', xp: 650, color: '#4a9eff' },
      { name: 'Writing', level: 80, icon: '✍️', description: 'Content writing and copy', xp: 950, color: '#ffd93d' },
      { name: 'Editing', level: 65, icon: '✂️', description: 'Video and photo editing', xp: 520, color: '#6bcb77' },
      { name: 'Social Media', level: 85, icon: '📱', description: 'Social media management', xp: 1100, color: '#7d26ff' },
    ],
  };

  // Missions data per career
  const missionsData = {
    developer: [
      { name: 'Build a Portfolio Website', xp: 500, status: 'completed', description: 'Create a personal portfolio site' },
      { name: 'Contribute to Open Source', xp: 1000, status: 'active', description: 'Make a PR to an open source project' },
      { name: 'Learn a New Framework', xp: 750, status: 'pending', description: 'Pick up a new framework' },
      { name: 'Build a Full-Stack App', xp: 1200, status: 'pending', description: 'Create a complete app' },
    ],
    designer: [
      { name: 'Create a Design System', xp: 500, status: 'active', description: 'Build a comprehensive design system' },
      { name: 'Redesign a Landing Page', xp: 400, status: 'pending', description: 'Improve an existing landing page' },
      { name: 'Learn Motion Design', xp: 600, status: 'pending', description: 'Master motion design principles' },
    ],
    business: [
      { name: 'Create a Business Plan', xp: 500, status: 'active', description: 'Write a detailed business plan' },
      { name: 'Market Research', xp: 400, status: 'pending', description: 'Conduct thorough market research' },
      { name: 'Financial Modeling', xp: 600, status: 'pending', description: 'Build a financial model' },
    ],
    student: [
      { name: 'Study for Exams', xp: 500, status: 'completed', description: 'Prepare for upcoming exams' },
      { name: 'Complete a Research Paper', xp: 800, status: 'active', description: 'Write and submit a research paper' },
      { name: 'Learn a New Subject', xp: 450, status: 'pending', description: 'Explore a new academic subject' },
    ],
    fitness: [
      { name: 'Run 5K', xp: 500, status: 'completed', description: 'Complete a 5K run' },
      { name: 'Increase Strength', xp: 400, status: 'active', description: 'Hit new strength goals' },
      { name: 'Perfect Form', xp: 300, status: 'pending', description: 'Master proper exercise form' },
    ],
    creator: [
      { name: 'Post 30 Days of Content', xp: 500, status: 'active', description: 'Post content for 30 days straight' },
      { name: 'Grow Audience by 50%', xp: 400, status: 'pending', description: 'Increase your audience size' },
      { name: 'Create a Content Calendar', xp: 300, status: 'pending', description: 'Plan your content schedule' },
    ],
  };

  const currentCareer = careers.find(c => c.id === selectedCareer);
  const currentSkills = skillsData[selectedCareer] || [];
  const currentMissions = missionsData[selectedCareer] || [];

  const handleCareerSwitch = (careerId) => {
    setSelectedCareer(careerId);
    setShowCareerSwitch(false);
    toast.success(`Switched to ${careers.find(c => c.id === careerId)?.name} career!`);
  };

  const handleSkillClick = (skill) => {
    setSelectedSkill(skill);
    setShowSkillDetail(true);
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold gradient-text">Career Path</h1>
          <p className="text-gray-400">Level up your professional skills and advance your career</p>
        </div>
        <Button
          variant="outline"
          icon={Briefcase}
          onClick={() => setShowCareerSwitch(true)}
        >
          Switch Career
        </Button>
      </div>

      {/* Career Overview */}
      <div className="glass-effect rounded-xl p-6 border border-white/20">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${currentCareer?.color} flex items-center justify-center flex-shrink-0`}>
            {currentCareer && <currentCareer.icon className="w-10 h-10 text-white" />}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <h2 className="text-2xl font-bold text-white">{currentCareer?.name}</h2>
              <span className="px-2 py-1 bg-primary-500/20 text-primary-400 rounded-full text-xs font-medium">
                Level {currentCareer?.level}
              </span>
              <span className={`px-2 py-1 ${getRankBgColor(currentCareer?.rank)} ${getRankColor(currentCareer?.rank)} rounded-full text-xs font-medium`}>
                Rank {currentCareer?.rank}
              </span>
            </div>
            <p className="text-gray-400 mt-1">{currentCareer?.description}</p>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-400">
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400" />
                <span>{currentCareer?.progress}% Complete</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap className="w-4 h-4 text-yellow-400" />
                <span>{currentCareer?.xp} XP</span>
              </div>
              <div className="flex items-center gap-1">
                <Target className="w-4 h-4 text-blue-400" />
                <span>{currentMissions.filter(m => m.status === 'completed').length} Missions Completed</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="small" icon={FileText}>
              Resume
            </Button>
            <Button variant="outline" size="small" icon={Settings}>
              Settings
            </Button>
          </div>
        </div>

        {/* Career Progress */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-gray-400 mb-1">
            <span>Career Progress</span>
            <span>{currentCareer?.progress}%</span>
          </div>
          <div className="w-full bg-white/10 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${currentCareer?.progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className={`bg-gradient-to-r ${currentCareer?.color} h-2 rounded-full`}
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-white/10">
        <div className="flex space-x-6 overflow-x-auto">
          {['overview', 'skills', 'missions', 'progress', 'resources'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 text-sm font-medium transition border-b-2 whitespace-nowrap
                ${activeTab === tab 
                  ? 'text-primary-400 border-primary-400' 
                  : 'text-gray-400 border-transparent hover:text-white'
                }
              `}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'overview' && (
              <OverviewTab 
                career={currentCareer} 
                skills={currentSkills} 
                missions={currentMissions}
                onSkillClick={handleSkillClick}
              />
            )}
            {activeTab === 'skills' && (
              <SkillsTab 
                skills={currentSkills}
                onSkillClick={handleSkillClick}
              />
            )}
            {activeTab === 'missions' && (
              <MissionsTab missions={currentMissions} />
            )}
            {activeTab === 'progress' && (
              <ProgressTab career={currentCareer} skills={currentSkills} />
            )}
            {activeTab === 'resources' && (
              <ResourcesTab careerId={selectedCareer} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Career Switch Modal */}
      <AnimatePresence>
        {showCareerSwitch && (
          <CareerSwitchModal
            careers={careers}
            currentCareer={selectedCareer}
            onClose={() => setShowCareerSwitch(false)}
            onSelect={handleCareerSwitch}
          />
        )}
      </AnimatePresence>

      {/* Skill Detail Modal */}
      <AnimatePresence>
        {showSkillDetail && selectedSkill && (
          <SkillDetailModal
            skill={selectedSkill}
            onClose={() => {
              setShowSkillDetail(false);
              setSelectedSkill(null);
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================
// SUB-COMPONENTS
// ============================================

// Overview Tab
const OverviewTab = ({ career, skills, missions, onSkillClick }) => {
  const topSkills = skills.slice(0, 5);
  const activeMissions = missions.filter(m => m.status === 'active');
  const completedMissions = missions.filter(m => m.status === 'completed');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Skills Overview */}
      <div className="glass-effect rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Brain className="w-5 h-5 text-primary-400" />
          Skills Overview
        </h3>
        <div className="space-y-3">
          {topSkills.map((skill, index) => (
            <div 
              key={index} 
              className="cursor-pointer hover:bg-white/5 p-2 rounded-lg transition"
              onClick={() => onSkillClick(skill)}
            >
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">{skill.icon} {skill.name}</span>
                <span className="text-white">{skill.level}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full"
                />
              </div>
            </div>
          ))}
        </div>
        {skills.length > 5 && (
          <button className="mt-3 text-sm text-primary-400 hover:text-primary-300 transition">
            View all {skills.length} skills →
          </button>
        )}
      </div>
      
      {/* Active Missions */}
      <div className="glass-effect rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          Active Missions
        </h3>
        <div className="space-y-3">
          {activeMissions.length > 0 ? (
            activeMissions.map((mission, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-white/5 rounded-lg">
                <div>
                  <p className="text-sm text-white">{mission.name}</p>
                  <p className="text-xs text-gray-400">{mission.xp} XP</p>
                </div>
                <span className="text-xs px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded-full">
                  Active
                </span>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-400">
              <p className="text-sm">No active missions</p>
              <p className="text-xs">Complete missions to advance your career</p>
            </div>
          )}
        </div>
        {completedMissions.length > 0 && (
          <div className="mt-4 pt-4 border-t border-white/10">
            <p className="text-xs text-gray-400">
              ✅ {completedMissions.length} missions completed
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

// Skills Tab
const SkillsTab = ({ skills, onSkillClick }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterLevel, setFilterLevel] = useState('all');

  const filteredSkills = skills.filter(skill => {
    const matchesSearch = skill.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLevel = filterLevel === 'all' || 
      (filterLevel === 'high' && skill.level >= 70) ||
      (filterLevel === 'medium' && skill.level >= 40 && skill.level < 70) ||
      (filterLevel === 'low' && skill.level < 40);
    return matchesSearch && matchesLevel;
  });

  return (
    <div className="glass-effect rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Skill Details</h3>
      
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <div className="flex-1">
          <Input
            icon={Search}
            placeholder="Search skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'high', 'medium', 'low'].map((level) => (
            <button
              key={level}
              onClick={() => setFilterLevel(level)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                filterLevel === level
                  ? 'bg-primary-500 text-white'
                  : 'bg-white/5 text-gray-400 hover:text-white'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.05 }}
            className="p-4 bg-white/5 rounded-lg cursor-pointer hover:bg-white/10 transition border border-white/10 hover:border-primary-500/30"
            onClick={() => onSkillClick(skill)}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{skill.icon}</span>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-white">{skill.name}</p>
                  <span className="text-xs font-medium text-white">{skill.level}%</span>
                </div>
                <div className="flex-1 bg-white/10 rounded-full h-1.5 mt-1">
                  <div
                    className="bg-gradient-to-r from-primary-500 to-secondary-500 h-1.5 rounded-full transition-all"
                    style={{ width: `${skill.level}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{skill.description}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Zap className="w-3 h-3 text-yellow-400" />
                  <span className="text-xs text-gray-400">{skill.xp} XP</span>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No skills found matching your criteria</p>
        </div>
      )}
    </div>
  );
};

// Missions Tab
const MissionsTab = ({ missions }) => {
  const [filter, setFilter] = useState('all');

  const filteredMissions = missions.filter(m => {
    if (filter === 'all') return true;
    return m.status === filter;
  });

  const getStatusColor = (status) => {
    const colors = {
      completed: 'bg-green-500/20 text-green-400',
      active: 'bg-yellow-500/20 text-yellow-400',
      pending: 'bg-gray-500/20 text-gray-400',
    };
    return colors[status] || 'bg-gray-500/20 text-gray-400';
  };

  const getStatusIcon = (status) => {
    if (status === 'completed') return <CheckCircle className="w-4 h-4 text-green-400" />;
    if (status === 'active') return <Clock className="w-4 h-4 text-yellow-400" />;
    return <Target className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="glass-effect rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Career Missions</h3>
      
      <div className="flex gap-2 mb-4">
        {['all', 'active', 'pending', 'completed'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              filter === status
                ? 'bg-primary-500 text-white'
                : 'bg-white/5 text-gray-400 hover:text-white'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filteredMissions.map((mission, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-center justify-between p-3 bg-white/5 rounded-lg hover:bg-white/10 transition"
          >
            <div className="flex items-center gap-3">
              {getStatusIcon(mission.status)}
              <div>
                <p className="text-sm text-white">{mission.name}</p>
                <p className="text-xs text-gray-400">{mission.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-yellow-400">{mission.xp} XP</span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(mission.status)}`}>
                {mission.status}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredMissions.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <p>No missions found</p>
        </div>
      )}
    </div>
  );
};

// Progress Tab
const ProgressTab = ({ career, skills }) => {
  const averageSkill = skills.reduce((sum, s) => sum + s.level, 0) / (skills.length || 1);

  return (
    <div className="space-y-6">
      <div className="glass-effect rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Progress Tracking</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <p className="text-xs text-gray-400">Career Level</p>
            <p className="text-2xl font-bold text-white">{career?.level || 1}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <p className="text-xs text-gray-400">Total XP</p>
            <p className="text-2xl font-bold text-yellow-400">{career?.xp?.toLocaleString() || 0}</p>
          </div>
          <div className="p-4 bg-white/5 rounded-lg text-center">
            <p className="text-xs text-gray-400">Average Skill</p>
            <p className="text-2xl font-bold text-primary-400">{Math.round(averageSkill)}%</p>
          </div>
        </div>
      </div>

      <div className="glass-effect rounded-xl p-6 border border-white/20">
        <h3 className="text-lg font-semibold text-white mb-4">Skill Distribution</h3>
        <div className="space-y-3">
          {skills.map((skill, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm">
                <span className="text-gray-300">{skill.icon} {skill.name}</span>
                <span className="text-white">{skill.level}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Resources Tab
const ResourcesTab = ({ careerId }) => {
  const resources = {
    developer: [
      { name: 'Online Courses', icon: BookOpen, description: 'Access premium coding courses', url: '#' },
      { name: 'Mentorship', icon: Users, description: 'Connect with senior developers', url: '#' },
      { name: 'Open Source Projects', icon: Github, description: 'Contribute to open source', url: '#' },
      { name: 'Developer Community', icon: Globe, description: 'Join the developer community', url: '#' },
    ],
    designer: [
      { name: 'Design Courses', icon: BookOpen, description: 'Learn design principles', url: '#' },
      { name: 'Design Community', icon: Users, description: 'Connect with designers', url: '#' },
      { name: 'Design Inspiration', icon: Globe, description: 'Find design inspiration', url: '#' },
    ],
    business: [
      { name: 'Business Courses', icon: BookOpen, description: 'Learn business fundamentals', url: '#' },
      { name: 'Business Network', icon: Users, description: 'Connect with entrepreneurs', url: '#' },
      { name: 'Market Research', icon: Globe, description: 'Access market data', url: '#' },
    ],
    student: [
      { name: 'Study Resources', icon: BookOpen, description: 'Access study materials', url: '#' },
      { name: 'Tutoring', icon: Users, description: 'Connect with tutors', url: '#' },
      { name: 'Research Tools', icon: Globe, description: 'Research databases', url: '#' },
    ],
    fitness: [
      { name: 'Workout Plans', icon: BookOpen, description: 'Custom workout plans', url: '#' },
      { name: 'Fitness Community', icon: Users, description: 'Connect with fitness enthusiasts', url: '#' },
      { name: 'Nutrition Guides', icon: Globe, description: 'Access nutrition resources', url: '#' },
    ],
    creator: [
      { name: 'Content Creation', icon: BookOpen, description: 'Learn content creation', url: '#' },
      { name: 'Creator Community', icon: Users, description: 'Connect with creators', url: '#' },
      { name: 'Distribution Channels', icon: Globe, description: 'Find distribution channels', url: '#' },
    ],
  };

  const careerResources = resources[careerId] || resources.developer;

  return (
    <div className="glass-effect rounded-xl p-6 border border-white/20">
      <h3 className="text-lg font-semibold text-white mb-4">Learning Resources</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {careerResources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 bg-white/5 rounded-lg hover:bg-white/10 transition cursor-pointer border border-white/10 hover:border-primary-500/30 group"
            >
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary-500/20 rounded-lg">
                  <Icon className="w-5 h-5 text-primary-400" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-white group-hover:text-primary-400 transition">
                    {resource.name}
                  </p>
                  <p className="text-xs text-gray-400">{resource.description}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-primary-400 transition" />
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

// Career Switch Modal
const CareerSwitchModal = ({ careers, currentCareer, onClose, onSelect }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-800 rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-white">Switch Career</h2>
              <p className="text-gray-400">Choose a new career path to focus on</p>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {careers.map((career) => {
              const Icon = career.icon;
              const isSelected = career.id === currentCareer;
              return (
                <button
                  key={career.id}
                  onClick={() => onSelect(career.id)}
                  className={`
                    p-4 rounded-lg text-left transition border
                    ${isSelected 
                      ? 'border-primary-500 bg-primary-500/10' 
                      : 'bg-white/5 hover:bg-white/10 border-white/10 hover:border-white/20'
                    }
                  `}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${career.color} flex items-center justify-center mb-2`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-white">{career.name}</p>
                  <p className="text-xs text-gray-400">{career.description}</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="text-xs text-gray-400">Level {career.level}</span>
                    <span className={`text-xs ${getRankColor(career.rank)}`}>Rank {career.rank}</span>
                  </div>
                  {isSelected && (
                    <div className="mt-2 text-xs text-primary-400 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      Current Career
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Skill Detail Modal
const SkillDetailModal = ({ skill, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-dark-800 rounded-xl max-w-md w-full border border-white/20"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{skill.icon}</span>
              <div>
                <h3 className="text-xl font-bold text-white">{skill.name}</h3>
                <p className="text-sm text-gray-400">{skill.description}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-lg transition">
              <X className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-white/5 rounded-lg">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">Proficiency</span>
                <span className="text-white font-medium">{skill.level}%</span>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-primary-500 to-secondary-500 h-2 rounded-full transition-all"
                  style={{ width: `${skill.level}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-white/5 rounded-lg text-center">
                <p className="text-xs text-gray-400">XP Earned</p>
                <p className="text-lg font-bold text-yellow-400">{skill.xp}</p>
              </div>
              <div className="p-3 bg-white/5 rounded-lg text-center">
                <p className="text-xs text-gray-400">Level</p>
                <p className="text-lg font-bold text-white">
                  {skill.level >= 80 ? 'Expert' : skill.level >= 60 ? 'Advanced' : skill.level >= 40 ? 'Intermediate' : 'Beginner'}
                </p>
              </div>
            </div>

            <div className="p-4 bg-white/5 rounded-lg">
              <h4 className="text-sm font-medium text-white mb-2">Growth Tips</h4>
              <ul className="space-y-1 text-sm text-gray-400">
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">•</span>
                  <span>Practice {skill.name} daily for 30 minutes</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">•</span>
                  <span>Complete relevant missions to earn XP</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary-400 mt-0.5">•</span>
                  <span>Connect with mentors in this area</span>
                </li>
              </ul>
            </div>

            <Button variant="gradient" className="w-full" onClick={onClose}>
              Got it!
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Loading Skeleton
const LoadingSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    <div className="flex items-center justify-between">
      <div>
        <div className="h-8 w-48 bg-white/5 rounded"></div>
        <div className="h-4 w-64 bg-white/5 rounded mt-2"></div>
      </div>
      <div className="h-10 w-32 bg-white/5 rounded"></div>
    </div>
    <div className="h-40 bg-white/5 rounded-xl"></div>
    <div className="h-12 bg-white/5 rounded-xl"></div>
    <div className="grid grid-cols-2 gap-6">
      <div className="h-64 bg-white/5 rounded-xl"></div>
      <div className="h-64 bg-white/5 rounded-xl"></div>
    </div>
  </div>
);

export default Career;