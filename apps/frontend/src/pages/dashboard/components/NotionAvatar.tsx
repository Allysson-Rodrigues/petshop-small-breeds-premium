
interface NotionAvatarProps {
  name: string;
  type: "human" | "pet";
  breed?: string;
  gender?: "male" | "female";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function NotionAvatar({ name, type, breed, gender, size = "md", className = "" }: NotionAvatarProps) {
  const getAvatarPath = () => {
    if (type === "human") {
      if (gender === "male") return "/avatars/human_1.png";
      if (gender === "female") return "/avatars/human_2.png";

      const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
      const index = (sum % 2) + 1;
      return `/avatars/human_${index}.png`;
    }

    // Breed mapping (case-insensitive)
    const breedMap: { [key: string]: string } = {
      poodle: "pet_poodle",
      chihuahua: "pet_chihuahua",
      "maltês": "pet_maltes",
      maltes: "pet_maltes",
      yorkshire: "pet_yorkshire",
      terrier: "pet_yorkshire",
      shih: "pet_shih_tzu",
      tzu: "pet_shih_tzu",
      pug: "pet_pug",
      french: "pet_french_bulldog",
      bulldog: "pet_french_bulldog",
    };

    const searchStr = (breed || name).toLowerCase();
    for (const [key, value] of Object.entries(breedMap)) {
      if (searchStr.includes(key)) return `/avatars/${value}.png`;
    }

    // Default pool for unknown pets
    const sum = name.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = (sum % 4) + 1; // Pool of poodle, chihuahua, shih_tzu, yorkshire
    const pool = ["pet_poodle", "pet_chihuahua", "pet_shih_tzu", "pet_yorkshire"];
    return `/avatars/${pool[index - 1]}.png`;
  };

  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
    xl: "w-16 h-16",
  };

  return (
    <div className={`${sizeClasses[size]} rounded-lg overflow-hidden border border-gray-100 bg-gray-50 flex-shrink-0 ${className}`}>
      <img
        src={getAvatarPath()}
        alt={name}
        className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500"
      />
    </div>
  );
}
