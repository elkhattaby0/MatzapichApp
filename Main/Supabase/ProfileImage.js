import { supabase } from "./supabase";

const ProfileImage = async (file, userId, bucket = "profileImage") => {
    if (!file || !userId) {
        return { success: false, message: 'File and User ID are required.' };
    }

    try {
        const fileName = `${userId}-${Date.now()}.${file.name.split('.').pop()}`;
        const { data, error } = await supabase.storage
            .from(bucket)
            .upload(fileName, {
                uri: file.uri,
                type: file.type,
                size: file.size,
            });

        if (error) {
            throw new Error(`Error uploading file: ${error.message}`);
        }

        const { publicUrl } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path);

        if (!publicUrl) {
            throw new Error('Failed to generate public URL for the file.');
        }

        const { error: fileInsertError } = await supabase
            .from("files")
            .insert([
                {
                    user_id: userId,
                    file_type: file.type,
                    file_url: publicUrl,
                    file_size: file.size,
                }
            ]);

        if (fileInsertError) {
            throw new Error(`Error inserting file metadata: ${fileInsertError.message}`);
        }

        const { error: userUpdateError } = await supabase
            .from('users')
            .update({ profile_picture_url: publicUrl })
            .eq('id', userId);

        if (userUpdateError) {
            throw new Error(`Error updating user profile: ${userUpdateError.message}`);
        }

        return { success: true, message: 'Profile picture updated successfully!', publicUrl };
    } catch (error) {
        console.error(error.message);
        return { success: false, message: error.message };
    }
};

export default ProfileImage;
