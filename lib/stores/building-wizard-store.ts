import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * Type-safe wizard steps
 */
export type WizardStep = 'category' | 'subcategory' | 'building' | 'configuration';

/**
 * Navigation path through the wizard
 */
export interface WizardPath {
  categoryId?: string;
  subcategoryId?: string;
  buildingId?: string;
}

/**
 * Building configuration
 */
export interface BuildingConfig {
  level: number;
  quantity: number;
  notes?: string;
}

/**
 * Complete wizard state
 */
interface BuildingWizardState {
  // UI State
  isOpen: boolean;
  currentStep: WizardStep;
  
  // Navigation path
  path: WizardPath;
  
  // Building configuration
  config: BuildingConfig;
  
  // Actions
  openWizard: () => void;
  closeWizard: () => void;
  resetWizard: () => void;
  
  // Navigation actions
  selectCategory: (categoryId: string) => void;
  selectSubcategory: (subcategoryId: string) => void;
  selectBuilding: (buildingId: string) => void;
  goBack: () => void;
  
  // Configuration actions
  updateConfig: (config: Partial<BuildingConfig>) => void;
  
  // Final submission
  submitBuilding: () => Promise<void>;
}

/**
 * Initial configuration defaults
 */
const DEFAULT_CONFIG: BuildingConfig = {
  level: 1,
  quantity: 1,
  notes: undefined,
};

/**
 * Building wizard store with automatic step management
 */
export const useBuildingWizard = create<BuildingWizardState>()(
  devtools(
    (set, get) => ({
      // Initial state
      isOpen: false,
      currentStep: 'category',
      path: {},
      config: DEFAULT_CONFIG,

      // UI actions
      openWizard: () => set({ isOpen: true }),
      
      closeWizard: () => {
        set({ isOpen: false });
        // Reset after animation
        setTimeout(() => get().resetWizard(), 300);
      },
      
      resetWizard: () => set({
        currentStep: 'category',
        path: {},
        config: DEFAULT_CONFIG,
      }),

      // Navigation with automatic step progression
      selectCategory: (categoryId) => set((state) => ({
        path: { categoryId },
        currentStep: 'subcategory',
      })),

      selectSubcategory: (subcategoryId) => set((state) => ({
        path: { ...state.path, subcategoryId },
        currentStep: 'building',
      })),

      selectBuilding: (buildingId) => set((state) => ({
        path: { ...state.path, buildingId },
        currentStep: 'configuration',
      })),

      goBack: () => set((state) => {
        switch (state.currentStep) {
          case 'subcategory':
            return { 
              currentStep: 'category', 
              path: {} 
            };
          
          case 'building':
            return { 
              currentStep: 'subcategory', 
              path: { categoryId: state.path.categoryId } 
            };
          
          case 'configuration':
            return { 
              currentStep: 'building',
              path: { 
                categoryId: state.path.categoryId,
                subcategoryId: state.path.subcategoryId 
              } 
            };
          
          default:
            return state;
        }
      }),

      // Configuration
      updateConfig: (configUpdate) => set((state) => ({
        config: { ...state.config, ...configUpdate },
      })),

      // Final submission
      submitBuilding: async () => {
        const { path, config, closeWizard } = get();
        
        // Validation
        if (!path.buildingId) {
          throw new Error('No building selected');
        }

        // Build final payload
        const payload = {
          ...path,
          ...config,
          timestamp: new Date().toISOString(),
        };

        try {
          // TODO: Replace with actual API call
          console.log('Submitting building:', payload);
          
          // Simulate API call
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Close and reset on success
          closeWizard();
          
          // Optional: Show success toast
          // toast.success('Building added successfully');
        } catch (error) {
          console.error('Failed to submit building:', error);
          throw error;
        }
      },
    }),
    { name: 'BuildingWizard' }
  )
);

/**
 * Selector hooks for optimized re-renders
 */
export const useWizardStep = () => useBuildingWizard(state => state.currentStep);
export const useWizardPath = () => useBuildingWizard(state => state.path);
export const useWizardConfig = () => useBuildingWizard(state => state.config);
export const useWizardIsOpen = () => useBuildingWizard(state => state.isOpen);
