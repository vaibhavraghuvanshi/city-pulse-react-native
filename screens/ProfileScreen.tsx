import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Switch, 
  FlatList,
  Alert,
  Image,
  ScrollView,
  Modal,
  Pressable
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { useFavorites } from '../hooks/useFavorites';
import { useTheme, ThemeType } from '../hooks/useTheme';
import { useLanguage, LanguageType } from '../hooks/useLanguage';
import { useUserProfile } from '../hooks/useUserProfile';
import { EventCard } from '../components/EventCard';

export default function ProfileScreen() {
  const navigation = useNavigation();
  const { user, logout } = useAuth();
  const { favorites, toggleFavorite } = useFavorites();
  const { theme, colors, isDark, setTheme } = useTheme();
  const { language, isRTL, t, setLanguage, toggleRTL } = useLanguage();
  const { profileImage, userName, setProfileImage, setUserName } = useUserProfile();
  
  const [languageModalVisible, setLanguageModalVisible] = useState(false);
  const [themeModalVisible, setThemeModalVisible] = useState(false);
  const [profileImageOptions, setProfileImageOptions] = useState([
    'https://api.a0.dev/assets/image?text=User%20Avatar%201&aspect=1:1&seed=1',
    'https://api.a0.dev/assets/image?text=User%20Avatar%202&aspect=1:1&seed=2',
    'https://api.a0.dev/assets/image?text=User%20Avatar%203&aspect=1:1&seed=3',
    'https://api.a0.dev/assets/image?text=User%20Avatar%204&aspect=1:1&seed=4',
  ]);
  const [avatarModalVisible, setAvatarModalVisible] = useState(false);

  // Set default username if not set
  useEffect(() => {
    if (!userName && user?.email) {
      setUserName(user.email.split('@')[0]);
    }
  }, [user, userName]);

  const handleLogout = async () => {
    try {
      await logout();
      navigation.reset({
        index: 0,
        routes: [{ name: 'Auth' }],
      });
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleRTLToggle = (value) => {
    Alert.alert(
      t('layoutDirection'),
      t('languageChangePrompt'),
      [
        {
          text: t('cancel'),
          style: 'cancel',
        },
        {
          text: t('ok'),
          onPress: () => {
            toggleRTL();
            Alert.alert(
              t('layoutChanged'),
              value ? t('layoutChangeSuccess') : t('layoutChangeSuccess')
            );
          },
        },
      ]
    );
  };

  const handleLanguageChange = (newLanguage: LanguageType) => {
    setLanguageModalVisible(false);
    
    if (newLanguage !== language) {
      Alert.alert(
        t('changeLanguage'),
        t('languageChangePrompt'),
        [
          {
            text: t('cancel'),
            style: 'cancel',
          },
          {
            text: t('ok'),
            onPress: () => {
              setLanguage(newLanguage);
              Alert.alert(
                t('languageChanged'),
                newLanguage === 'en' ? t('languageChangeSuccess') : t('languageChangeSuccess')
              );
            },
          },
        ]
      );
    }
  };

  const handleThemeChange = (newTheme: ThemeType) => {
    setThemeModalVisible(false);
    setTheme(newTheme);
  };

  const navigateToEventDetails = (event) => {
    navigation.navigate('EventDetail', { event });
  };

  const renderFavoriteItem = ({ item }) => (
    <EventCard 
      event={item}
      isFavorite={true}
      onToggleFavorite={() => toggleFavorite(item)}
      onPress={() => navigateToEventDetails(item)}
    />
  );

  const selectProfileImage = (imageUri) => {
    setProfileImage(imageUri);
    setAvatarModalVisible(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView>
        <View style={[styles.header, { 
          backgroundColor: colors.card, 
          borderBottomColor: colors.border,
          flexDirection: isRTL ? 'row-reverse' : 'row'
        }]}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name={isRTL ? "arrow-forward" : "arrow-back"} size={24} color={colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: colors.text }]}>{t('profile')}</Text>
          <View style={styles.placeholder} />
        </View>

        <View style={[styles.profileSection, { backgroundColor: colors.card, borderBottomColor: colors.border }]}>
          <TouchableOpacity 
            style={styles.avatarContainer}
            onPress={() => setAvatarModalVisible(true)}
          >
            {profileImage ? (
              <Image 
                source={{ uri: profileImage }} 
                style={styles.avatar} 
              />
            ) : (
              <Ionicons name="person-circle" size={100} color={colors.primary} />
            )}
            <View style={styles.editIconContainer}>
              <Ionicons name="camera" size={20} color="#fff" />
            </View>
          </TouchableOpacity>
          <Text style={[styles.userName, { color: colors.text }]}>{userName || user?.email || 'User'}</Text>
        </View>

        <View style={[styles.settingsSection, { 
          backgroundColor: colors.card, 
          borderTopColor: colors.border,
          borderBottomColor: colors.border
        }]}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('settings')}</Text>
          
          {/* Language Setting */}
          <TouchableOpacity 
            style={[styles.settingRow, { 
              borderBottomColor: colors.border,
              flexDirection: isRTL ? 'row-reverse' : 'row'
            }]}
            onPress={() => setLanguageModalVisible(true)}
          >
            <View style={[styles.settingLabelContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons 
                name="language-outline" 
                size={24} 
                color={colors.textSecondary} 
                style={isRTL ? styles.settingIconRTL : styles.settingIcon} 
              />
              <Text style={[styles.settingLabel, { color: colors.text }]}>{t('language')}</Text>
            </View>
            <View style={[styles.settingValueContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.settingValue, { 
                color: colors.textSecondary,
                marginRight: isRTL ? 0 : 5,
                marginLeft: isRTL ? 5 : 0
              }]}>
                {language === 'en' ? t('english') : t('arabic')}
              </Text>
              <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
          
          {/* RTL Setting */}
          <View style={[styles.settingRow, { 
            borderBottomColor: colors.border,
            flexDirection: isRTL ? 'row-reverse' : 'row'
          }]}>
            <View style={[styles.settingLabelContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons 
                name="swap-horizontal-outline" 
                size={24} 
                color={colors.textSecondary} 
                style={isRTL ? styles.settingIconRTL : styles.settingIcon} 
              />
              <Text style={[styles.settingLabel, { color: colors.text }]}>{t('rtlLayout')}</Text>
            </View>
            <Switch
              value={isRTL}
              onValueChange={handleRTLToggle}
              trackColor={{ false: "#ddd", true: colors.primary }}
              thumbColor="#fff"
            />
          </View>
          
          {/* Theme Setting */}
          <TouchableOpacity 
            style={[styles.settingRow, { 
              borderBottomColor: colors.border,
              flexDirection: isRTL ? 'row-reverse' : 'row'
            }]}
            onPress={() => setThemeModalVisible(true)}
          >
            <View style={[styles.settingLabelContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Ionicons 
                name={isDark ? "moon-outline" : "sunny-outline"} 
                size={24} 
                color={colors.textSecondary} 
                style={isRTL ? styles.settingIconRTL : styles.settingIcon} 
              />
              <Text style={[styles.settingLabel, { color: colors.text }]}>{t('darkMode')}</Text>
            </View>
            <View style={[styles.settingValueContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
              <Text style={[styles.settingValue, { 
                color: colors.textSecondary,
                marginRight: isRTL ? 0 : 5,
                marginLeft: isRTL ? 5 : 0
              }]}>
                {theme === 'system' ? t('systemTheme') : (isDark ? 'On' : 'Off')}
              </Text>
              <Ionicons name={isRTL ? "chevron-back" : "chevron-forward"} size={20} color={colors.textSecondary} />
            </View>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.logoutButton, { backgroundColor: colors.error }]}
            onPress={handleLogout}
          >
            <Ionicons 
              name="log-out-outline" 
              size={24} 
              color="#fff" 
              style={[styles.logoutIcon, isRTL && styles.logoutIconRTL]} 
            />
            <Text style={styles.logoutText}>{t('logout')}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.favoritesSection}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t('favorites')}</Text>
          
          {favorites.length > 0 ? (
            <FlatList
              data={favorites}
              renderItem={renderFavoriteItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={styles.favoritesList}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyFavorites}>
              <Ionicons name="heart-outline" size={60} color={colors.textTertiary} />
              <Text style={[styles.emptyText, { color: colors.textSecondary }]}>{t('noFavorites')}</Text>
              <Text style={[styles.emptySubtext, { color: colors.textTertiary }]}>
                {t('favoritePrompt')}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Language Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={languageModalVisible}
        onRequestClose={() => setLanguageModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('language')}</Text>
            
            <TouchableOpacity 
              style={[styles.modalOption, language === 'en' && styles.selectedOption]}
              onPress={() => handleLanguageChange('en')}
            >
              <Text style={[
                styles.modalOptionText, 
                { color: language === 'en' ? colors.primary : colors.text }
              ]}>
                {t('english')}
              </Text>
              {language === 'en' && (
                <Ionicons name="checkmark" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalOption, language === 'ar' && styles.selectedOption]}
              onPress={() => handleLanguageChange('ar')}
            >
              <Text style={[
                styles.modalOptionText, 
                { color: language === 'ar' ? colors.primary : colors.text }
              ]}>
                {t('arabic')}
              </Text>
              {language === 'ar' && (
                <Ionicons name="checkmark" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalCancelButton, { backgroundColor: colors.primary }]}
              onPress={() => setLanguageModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Theme Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={themeModalVisible}
        onRequestClose={() => setThemeModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>{t('darkMode')}</Text>
            
            <TouchableOpacity 
              style={[styles.modalOption, theme === 'light' && styles.selectedOption]}
              onPress={() => handleThemeChange('light')}
            >
              <Ionicons name="sunny-outline" size={24} color={theme === 'light' ? colors.primary : colors.text} />
              <Text style={[
                styles.modalOptionText, 
                { color: theme === 'light' ? colors.primary : colors.text }
              ]}>
                Light
              </Text>
              {theme === 'light' && (
                <Ionicons name="checkmark" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalOption, theme === 'dark' && styles.selectedOption]}
              onPress={() => handleThemeChange('dark')}
            >
              <Ionicons name="moon-outline" size={24} color={theme === 'dark' ? colors.primary : colors.text} />
              <Text style={[
                styles.modalOptionText, 
                { color: theme === 'dark' ? colors.primary : colors.text }
              ]}>
                Dark
              </Text>
              {theme === 'dark' && (
                <Ionicons name="checkmark" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalOption, theme === 'system' && styles.selectedOption]}
              onPress={() => handleThemeChange('system')}
            >
              <Ionicons name="settings-outline" size={24} color={theme === 'system' ? colors.primary : colors.text} />
              <Text style={[
                styles.modalOptionText, 
                { color: theme === 'system' ? colors.primary : colors.text }
              ]}>
                {t('systemTheme')}
              </Text>
              {theme === 'system' && (
                <Ionicons name="checkmark" size={24} color={colors.primary} />
              )}
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[styles.modalCancelButton, { backgroundColor: colors.primary }]}
              onPress={() => setThemeModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Avatar Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={avatarModalVisible}
        onRequestClose={() => setAvatarModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.text }]}>Select Profile Image</Text>
            
            <View style={styles.avatarGrid}>
              {profileImageOptions.map((imageUri, index) => (
                <TouchableOpacity 
                  key={index}
                  style={styles.avatarOption}
                  onPress={() => selectProfileImage(imageUri)}
                >
                  <Image source={{ uri: imageUri }} style={styles.avatarOptionImage} />
                </TouchableOpacity>
              ))}
            </View>
            
            <TouchableOpacity 
              style={[styles.modalCancelButton, { backgroundColor: colors.primary }]}
              onPress={() => setAvatarModalVisible(false)}
            >
              <Text style={styles.modalCancelText}>{t('cancel')}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    padding: 4,
  },
  placeholder: {
    width: 32,
  },
  profileSection: {
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
  },
  avatarContainer: {
    marginBottom: 10,
    position: 'relative',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#3498db',
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 8,
  },
  settingsSection: {
    padding: 20,
    marginTop: 20,
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  settingLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIcon: {
    marginRight: 10,
  },
  settingIconRTL: {
    marginLeft: 10,
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingValue: {
    marginRight: 5,
    fontSize: 14,
  },
  logoutButton: {
    flexDirection: 'row',
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  logoutIcon: {
    marginRight: 10,
  },
  logoutIconRTL: {
    marginRight: 0,
    marginLeft: 10,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  favoritesSection: {
    padding: 20,
  },
  favoritesList: {
    paddingBottom: 20,
  },
  emptyFavorites: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderRadius: 8,
    paddingHorizontal: 15,
  },
  selectedOption: {
    backgroundColor: 'rgba(52, 152, 219, 0.1)',
  },
  modalOptionText: {
    fontSize: 16,
    flex: 1,
    marginLeft: 10,
  },
  modalCancelButton: {
    borderRadius: 8,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  modalCancelText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  avatarOption: {
    width: '48%',
    marginBottom: 15,
  },
  avatarOptionImage: {
    width: '100%',
    height: 120,
    borderRadius: 10,
  },
});