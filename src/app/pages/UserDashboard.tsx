import { useContext, useState, useEffect } from 'react';
import { UserContext } from '@/App';
import Card from '@/components/Card';
import Button from '@/components/Button';
import Input from '@/components/Input';
import { useNavigate } from 'react-router-dom';
import Cropper from 'react-easy-crop';
import { Dialog } from '@headlessui/react';

const categories = [
  'Profile',
  'Photos',
  'Account Privacy',
  'Subscription',
  'Delete Account',
];

export default function UserDashboard() {
  const { username, name, email } = useContext(UserContext);
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Profile');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [profileName, setProfileName] = useState(name || '');
  const [profileEmail, setProfileEmail] = useState(email || '');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<any>(null);

  useEffect(() => {
    const img = localStorage.getItem(`profile_image_${username}`);
    setProfileImage(img);
    setProfileName(name || '');
    setProfileEmail(email || '');
  }, [username, name, email]);

  // Handle image selection and open cropper
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSelectedImage(reader.result);
          setShowCropper(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Get cropped image as base64
  const getCroppedImg = async (imageSrc: string, cropPixels: any) => {
    const image = new window.Image();
    image.src = imageSrc;
    await new Promise((resolve) => { image.onload = resolve; });
    const canvas = document.createElement('canvas');
    const size = Math.max(cropPixels.width, cropPixels.height);
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(
      image,
      cropPixels.x,
      cropPixels.y,
      cropPixels.width,
      cropPixels.height,
      0,
      0,
      size,
      size
    );
    return canvas.toDataURL('image/png');
  };

  // Save cropped image
  const handleCropSave = async () => {
    if (selectedImage && croppedAreaPixels) {
      const croppedImg = await getCroppedImg(selectedImage, croppedAreaPixels);
      if (croppedImg) {
        setProfileImage(croppedImg);
        localStorage.setItem(`profile_image_${username}`, croppedImg);
      }
      setShowCropper(false);
      setSelectedImage(null);
    }
  };

  // Save profile info (local only for now)
  const handleSave = () => {
    // Save name, headline, bio to localStorage (simulate backend)
    localStorage.setItem(`profile_name_${username}`, profileName);
    localStorage.setItem(`profile_headline_${username}`, headline);
    localStorage.setItem(`profile_bio_${username}`, bio);
    alert('Profile updated!');
  };

  // Get first letter for avatar fallback
  const displayLetter = (profileName && profileName.length > 0)
    ? profileName[0].toUpperCase()
    : (username ? username[0].toUpperCase() : '?');

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm mb-6">
        <div className="max-w-screen-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate('/dashboard')}>ProLearn</h1>
          <Button variant="secondary" size="small" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
        </div>
      </nav>
      <main className="max-[90vw] mx-auto px-2 sm:px-10 flex flex-col md:flex-row gap-12 md:gap-20">
        {/* Sidebar */}
        <aside className="w-full md:w-[260px] lg:w-[280px] mb-8 md:mb-0 flex-shrink-0">
          <Card className="flex flex-col items-center p-10 h-full">
            <div className="w-28 h-28 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border mb-6">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-4xl font-bold text-primary">{displayLetter}</span>
              )}
            </div>
            <div className="font-bold text-xl mb-2 text-center w-full truncate">{profileName || username}</div>
            <div className="text-gray-500 text-base mb-6 text-center w-full truncate">{profileEmail}</div>
            <div className="flex flex-col w-full space-y-3 mt-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`text-left px-5 py-3 rounded-lg transition-colors whitespace-nowrap w-full font-semibold text-base overflow-hidden ${activeTab === cat ? 'bg-primary text-white' : 'hover:bg-gray-100 text-gray-700'}`}
                  onClick={() => setActiveTab(cat)}
                  style={{ textOverflow: 'ellipsis' }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </Card>
        </aside>
        {/* Main Content */}
        <section className="flex-1 flex-grow min-w-0">
          <Card className="p-10 sm:p-16 md:p-20">
            {activeTab === 'Profile' && (
              <form className="space-y-8" onSubmit={e => { e.preventDefault(); handleSave(); }}>
                <div>
                  <label className="block text-base font-medium mb-2">Full Name</label>
                  <Input value={profileName} onChange={e => setProfileName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-base font-medium mb-2">Email</label>
                  <Input value={profileEmail} onChange={e => setProfileEmail(e.target.value)} required type="email" />
                </div>
                <div>
                  <label className="block text-base font-medium mb-2">Headline</label>
                  <Input value={headline} onChange={e => setHeadline(e.target.value)} placeholder="e.g. Instructor, Developer..." />
                </div>
                <div>
                  <label className="block text-base font-medium mb-2">Biography</label>
                  <textarea
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary min-h-[120px]"
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    rows={5}
                  />
                </div>
                <Button type="submit" className="w-full">Save</Button>
              </form>
            )}
            {activeTab === 'Photos' && (
              <div className="space-y-8">
                <div className="mb-6">
                  <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border mx-auto mb-3">
                    {profileImage ? (
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-4xl font-bold text-primary">{displayLetter}</span>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleImageChange} className="block w-full mt-2" />
                </div>
                <Button onClick={() => { setProfileImage(null); localStorage.removeItem(`profile_image_${username}`); }} className="w-full">Remove Photo</Button>
                {/* Cropper Modal */}
                {showCropper && (
                  <Dialog open={showCropper} onClose={() => setShowCropper(false)} className="fixed z-50 inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto">
                      <h2 className="font-bold mb-4">Crop your photo</h2>
                      <div className="relative w-full h-64 bg-gray-100">
                        <Cropper
                          image={selectedImage!}
                          crop={crop}
                          zoom={zoom}
                          aspect={1}
                          cropShape="round"
                          showGrid={false}
                          onCropChange={setCrop}
                          onZoomChange={setZoom}
                          onCropComplete={(_, croppedPixels) => setCroppedAreaPixels(croppedPixels)}
                        />
                      </div>
                      <div className="flex justify-end mt-4 space-x-2">
                        <Button variant="secondary" onClick={() => setShowCropper(false)}>Cancel</Button>
                        <Button onClick={handleCropSave}>Save</Button>
                      </div>
                    </div>
                  </Dialog>
                )}
              </div>
            )}
            {activeTab === 'Account Privacy' && (
              <div className="space-y-6">
                <h2 className="font-bold text-lg mb-2">Account Privacy</h2>
                <p className="text-gray-600 mb-4">Password change and privacy settings coming soon.</p>
                <Button disabled>Change Password</Button>
              </div>
            )}
            {activeTab === 'Subscription' && (
              <div className="space-y-6">
                <h2 className="font-bold text-lg mb-2">Subscription</h2>
                <p className="text-gray-600">Subscription management coming soon.</p>
              </div>
            )}
            {activeTab === 'Delete Account' && (
              <div className="space-y-6">
                <h2 className="font-bold text-lg mb-2 text-red-600">Delete Account</h2>
                <p className="text-gray-600 mb-4">This action is irreversible. All your data will be lost.</p>
                <Button variant="secondary" className="bg-red-600 hover:bg-red-700 text-white" disabled>Delete My Account</Button>
              </div>
            )}
          </Card>
        </section>
      </main>
      {/* Responsive: stack sidebar above content on mobile */}
      <style>{`
        @media (max-width: 900px) {
          main {
            flex-direction: column !important;
          }
          aside, section {
            width: 100% !important;
            min-width: 0 !important;
          }
        }
      `}</style>
    </div>
  );
} 