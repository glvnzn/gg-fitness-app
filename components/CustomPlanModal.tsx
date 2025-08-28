import React, { useState } from 'react';
import { StyleSheet, Modal, Pressable, TextInput, Alert } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { FastingPlan } from '@/types/fasting';
import { useThemeColor } from '@/hooks/useThemeColor';

interface CustomPlanModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (plan: FastingPlan) => void;
  currentPlan?: FastingPlan;
}

export function CustomPlanModal({ visible, onClose, onSave, currentPlan }: CustomPlanModalProps) {
  const [fastingHours, setFastingHours] = useState(currentPlan?.fastingHours.toString() || '16');
  const [eatingHours, setEatingHours] = useState(currentPlan?.eatingHours.toString() || '8');
  const [planName, setPlanName] = useState(currentPlan?.name || '');

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const borderColor = useThemeColor({ light: '#E0E0E0', dark: '#404040' }, 'border');

  const handleSave = () => {
    const fasting = parseInt(fastingHours);
    const eating = parseInt(eatingHours);

    if (isNaN(fasting) || isNaN(eating) || fasting < 1 || eating < 1) {
      Alert.alert('Invalid Input', 'Please enter valid numbers for fasting and eating hours.');
      return;
    }

    if (fasting + eating !== 24) {
      Alert.alert('Invalid Schedule', 'Fasting hours and eating hours must add up to 24.');
      return;
    }

    if (!planName.trim()) {
      Alert.alert('Missing Name', 'Please enter a name for your custom plan.');
      return;
    }

    const customPlan: FastingPlan = {
      id: 'custom',
      name: planName.trim(),
      fastingHours: fasting,
      eatingHours: eating,
      description: `${fasting} hours fasting, ${eating} hours eating window`
    };

    onSave(customPlan);
    onClose();
  };

  const handleReset = () => {
    setFastingHours('16');
    setEatingHours('8');
    setPlanName('');
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <ThemedView style={styles.overlay}>
        <ThemedView style={[styles.modal, { backgroundColor }]}>
          <ThemedText type="title" style={styles.title}>
            Create Custom Plan
          </ThemedText>

          <ThemedView style={styles.inputSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Plan Name
            </ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, borderColor }]}
              value={planName}
              onChangeText={setPlanName}
              placeholder="e.g., My Custom Fast"
              placeholderTextColor={textColor + '80'}
              maxLength={20}
            />
          </ThemedView>

          <ThemedView style={styles.inputSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Fasting Hours
            </ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, borderColor }]}
              value={fastingHours}
              onChangeText={setFastingHours}
              keyboardType="numeric"
              placeholder="16"
              placeholderTextColor={textColor + '80'}
              maxLength={2}
            />
          </ThemedView>

          <ThemedView style={styles.inputSection}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Eating Hours
            </ThemedText>
            <TextInput
              style={[styles.input, { color: textColor, borderColor }]}
              value={eatingHours}
              onChangeText={setEatingHours}
              keyboardType="numeric"
              placeholder="8"
              placeholderTextColor={textColor + '80'}
              maxLength={2}
            />
          </ThemedView>

          <ThemedView style={styles.previewSection}>
            <ThemedText style={styles.previewLabel}>Preview:</ThemedText>
            <ThemedText style={styles.previewText}>
              {fastingHours || '0'}h fasting + {eatingHours || '0'}h eating = {(parseInt(fastingHours || '0') + parseInt(eatingHours || '0'))}h
            </ThemedText>
            {(parseInt(fastingHours || '0') + parseInt(eatingHours || '0')) !== 24 && (
              <ThemedText style={styles.warningText}>
                ⚠️ Must equal 24 hours
              </ThemedText>
            )}
          </ThemedView>

          <ThemedView style={styles.buttonContainer}>
            <Pressable style={[styles.button, styles.cancelButton]} onPress={onClose}>
              <ThemedText style={styles.cancelButtonText}>Cancel</ThemedText>
            </Pressable>
            
            <Pressable style={[styles.button, styles.resetButton]} onPress={handleReset}>
              <ThemedText style={styles.resetButtonText}>Reset</ThemedText>
            </Pressable>
            
            <Pressable style={[styles.button, styles.saveButton]} onPress={handleSave}>
              <ThemedText style={styles.saveButtonText}>Save</ThemedText>
            </Pressable>
          </ThemedView>
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    width: '90%',
    maxWidth: 400,
    borderRadius: 16,
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginBottom: 24,
  },
  inputSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  previewSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(74, 175, 80, 0.1)',
    borderRadius: 8,
  },
  previewLabel: {
    fontWeight: '600',
    marginBottom: 4,
  },
  previewText: {
    fontSize: 16,
  },
  warningText: {
    color: '#F44336',
    fontSize: 14,
    marginTop: 4,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  resetButton: {
    backgroundColor: '#FF9800',
  },
  saveButton: {
    backgroundColor: '#4CAF50',
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '600',
  },
  resetButtonText: {
    color: 'white',
    fontWeight: '600',
  },
  saveButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});