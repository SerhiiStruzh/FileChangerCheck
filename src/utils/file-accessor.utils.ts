import axios from 'axios';

export const getEmailsOfFileAccessors = async (): Promise<string[]> => {
    try {
        const response = await axios.get(process.env.ACCESSOR_EMAIL_URL);
        return response.data.editors; 
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error; 
    }
};