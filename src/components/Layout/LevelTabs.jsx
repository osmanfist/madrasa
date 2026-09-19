import { useSchoolLevel } from '../../context/SchoolLevelContext';
import { useStudents } from '../../context/StudentContext';
import { useLanguage } from '../../context/LanguageContext';

function LevelTabs() {
  const { activeLevel, setActiveLevel, schoolLevels, getStudentCountsByLevel } = useSchoolLevel();
  const { students } = useStudents();
  const { t } = useLanguage();

  const counts = getStudentCountsByLevel(students);

  return (
    <div className="level-tabs-bar">
      <div className="level-tabs-container">
        {/* "All Levels" tab */}
        <button
          className={`level-tab ${activeLevel === 'all' ? 'active' : ''}`}
          onClick={() => setActiveLevel('all')}
          type="button"
        >
          <span className="level-tab-label">{t('allLevels')}</span>
          <span className="level-tab-count">({counts.all})</span>
        </button>

        {/* Per-level tabs */}
        {schoolLevels.map((level) => (
          <button
            key={level}
            className={`level-tab ${activeLevel === level ? 'active' : ''}`}
            onClick={() => setActiveLevel(level)}
            type="button"
          >
            <span className="level-tab-label">{t(level)}</span>
            <span className="level-tab-count">({counts[level] || 0})</span>
          </button>
        ))}
      </div>
    </div>
  );
}

export default LevelTabs;