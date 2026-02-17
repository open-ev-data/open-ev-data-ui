import { Modal } from '@/shared/ui/Modal/Modal';
import { Button } from '@/shared/ui/Button/Button';
import { Database, FileJson, FileText, Server, Code, Github } from 'lucide-react';
import styles from './AboutModal.module.css';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal = ({ isOpen, onClose }: AboutModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="About OpenEV Data Explorer"
      size="large" // Use large modal for better layout
    >
      <div className={styles.container}>
        <p className={styles.introText}>
          The <strong>OpenEV Data Explorer</strong> is a modern showcase application demonstrating
          the power of the{' '}
          <a
            href="https://github.com/open-ev-data/open-ev-data"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.introLink}
          >
            OpenEV Data Dataset
          </a>
          .
        </p>

        <div className={styles.contentGrid}>
          {/* Left Column: Context */}
          <div className={styles.infoColumn}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <Database className={styles.icon} size={20} />
                What is OpenEV Data?
              </h3>
              <p className={styles.text}>
                OpenEV Data is a community-driven, open-source dataset of electric vehicle
                specifications. It provides comprehensive data on EVs, including range, battery,
                charging curves, performance, and dimensions.
              </p>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                <Github className={styles.icon} size={20} />
                Open Source
              </h3>
              <p className={styles.text}>
                This project is fully open source! You can contribute to the dataset or this UI on
                GitHub to help the community grow.
              </p>
            </section>
          </div>

          {/* Right Column: Data Formats */}
          <div className={styles.formatsColumn}>
            <h3 className={styles.columnTitle}>Available Data Formats</h3>
            <p className={styles.columnSubtitle}>
              Consume the data automatically in your preferred format:
            </p>

            <div className={styles.formatGrid}>
              <div className={styles.formatCard}>
                <div className={styles.formatIcon}>
                  <FileJson size={24} />
                </div>
                <div className={styles.formatInfo}>
                  <span className={styles.formatName}>JSON</span>
                  <span className={styles.formatDesc}>Full Objects</span>
                </div>
              </div>

              <div className={styles.formatCard}>
                <div className={styles.formatIcon}>
                  <FileText size={24} />
                </div>
                <div className={styles.formatInfo}>
                  <span className={styles.formatName}>CSV</span>
                  <span className={styles.formatDesc}>Tabular Data</span>
                </div>
              </div>

              <div className={styles.formatCard}>
                <div className={styles.formatIcon}>
                  <Code size={24} />
                </div>
                <div className={styles.formatInfo}>
                  <span className={styles.formatName}>XML</span>
                  <span className={styles.formatDesc}>Strict Schena</span>
                </div>
              </div>

              <div className={styles.formatCard}>
                <div className={styles.formatIcon}>
                  <Database size={24} />
                </div>
                <div className={styles.formatInfo}>
                  <span className={styles.formatName}>SQLite</span>
                  <span className={styles.formatDesc}>Embedded DB</span>
                </div>
              </div>

              <div className={styles.formatCard}>
                <div className={styles.formatIcon}>
                  <Server size={24} />
                </div>
                <div className={styles.formatInfo}>
                  <span className={styles.formatName}>PostgreSQL</span>
                  <span className={styles.formatDesc}>Enterprise DB</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button
            variant="ghost"
            onClick={() => window.open('https://github.com/open-ev-data', '_blank')}
            className={styles.githubButton}
          >
            <Github size={18} />
            Visit GitHub
          </Button>
          <Button variant="primary" onClick={onClose} className={styles.closeButton}>
            Got it!
          </Button>
        </div>
      </div>
    </Modal>
  );
};
