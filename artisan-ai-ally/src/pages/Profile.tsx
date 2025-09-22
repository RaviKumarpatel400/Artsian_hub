import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useAuth } from "@/context/AuthContext";

const Profile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div className="p-6 text-center">Loading profile...</div>;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>

          {user.role === "craftsman" && (
            <>
              <p><strong>Shop/Brand Name:</strong> {user.shopName}</p>
              <p><strong>GSTIN:</strong> {user.gstin}</p>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
