import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { BinderItem, DirectoryItem, SnippetItem } from '../types/itemTypes';

interface DirectoryType {
    id: number;
    name: string;
    user_id: string;
    directory?: number | null;
    created_at: string;
    updated_at: string;
}

interface ItemState {
    items: BinderItem[];
    currentDirectory: DirectoryType| null;
    selectedSnippet: SnippetItem | null;
    loading: boolean;
    error: string | null;
}

const initialState: ItemState = {
    items: [],
    currentDirectory: null,
    selectedSnippet: null,
    loading: false,
    error: null
};


interface AddItemArgs {
    type: 'directory' | 'snippet';
    name: string;
    currentDirectoryId: number | null;
}


const api = 'https://d23cilp68kckkp.cloudfront.net';

export const fetchDirectoryContents = createAsyncThunk(
    'item/fetchDirectoryContents',
    async ({ directoryId, userId }: {directoryId: number | null, userId: string}, { rejectWithValue }) => {
        const endpoint = directoryId === null ? `/api/codebinder/directories/${userId}/` : `/api/codebinder/directories/${userId}/${directoryId}/`;
        try {
            const response = await axios.get(api + endpoint);
            return response.data;
        } catch (error) {
            return rejectWithValue('Failed to fetch directory contents');
        }
    }
);

export const updateSnippetContent = createAsyncThunk(
    'snippets/updateContent',
    async ({ snippetId, content, userId }: { snippetId: number, content: string, userId: string }, { rejectWithValue }) => {
        try {
            await axios.patch(api + `/api/codebinder/snippets/${userId}/${snippetId}/`, { content });
            return { snippetId, content };
        } catch (error) {
            return rejectWithValue('Failed to update content');
        }
    }
);


export const addItemAsync = createAsyncThunk(
    'item/addItem',
    async ({ type, name, currentDirectoryId, content = "", userId }: AddItemArgs & { content?: string, userId: string }, { rejectWithValue }) => {
        let payload;
        if (type === 'snippet') payload = { name, directory: currentDirectoryId, content };
        else payload = { name, directory: currentDirectoryId };

        const apiUrl = type === 'directory' ? `/api/codebinder/directories/${userId}/` : `/api/codebinder/snippets/${userId}/`;
        try {
            const response = await axios.post(api + apiUrl, payload);
            return { ...response.data, type };
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                return rejectWithValue('Failed to add item: ' + error.response.data);
            }
            return rejectWithValue('Failed to add item');
        }
    }
);

export const renameItemAsync = createAsyncThunk(
    'item/renameItem',
    async ({ itemId, newName, type, userId }: { itemId: number; newName: string; type: 'directory' | 'snippet'; userId: string}, { rejectWithValue }) => {

        const apiUrl = type === 'directory' ? `/api/codebinder/directories/${userId}/${itemId}/` : `/api/codebinder/snippets/${userId}/${itemId}/`;
        const payload = { name: newName };

        try {
            const response = await axios.patch(api + apiUrl, payload);
            return { ...response.data, itemId, type, newName };
        } catch (error) {
            return rejectWithValue('Failed to rename item');
        }
    }
);

export const moveItemAsync = createAsyncThunk(
    'item/moveItem',
    async ({ itemId, newDirectoryId, type, userId }: { itemId: number, newDirectoryId: number | null, type: 'directory' | 'snippet', userId: string }, { rejectWithValue }) => {
        const apiUrl = type === 'directory'
            ? `/api/codebinder/directories/${userId}/${itemId}/`
            : `/api/codebinder/snippets/${userId}/${itemId}/`;

        const payload = { directory: newDirectoryId };

        try {
            const response = await axios.patch(api + apiUrl, payload);
            return { ...response.data, type };
        } catch (error) {
            return rejectWithValue('Failed to move item');
        }
    }
);


export const deleteItemAsync = createAsyncThunk(
    'item/deleteItem',
    async ({ itemId, type, userId }: { itemId: number; type: 'directory' | 'snippet'; userId: string }, { rejectWithValue }) => {

        const apiUrl = type === 'directory' ? `/api/codebinder/directories/${userId}/${itemId}/` : `/api/codebinder/snippets/${userId}/${itemId}/`;
        try {
            await axios.delete(api + apiUrl);
            return { itemId, type }; // Return both itemId and type for potential reducer use
        } catch (error) {
            return rejectWithValue('Failed to delete item');
        }
    }
);

const itemSlice = createSlice({
    name: 'item',
    initialState,
    reducers: {
        setItems: (state, action: PayloadAction<BinderItem[]>) => {
            state.items = action.payload;
        },
        setCurrentDirectory: (state, action: PayloadAction<DirectoryType | null>) => {
            state.currentDirectory = action.payload;
        },
        setSelectedSnippet: (state, action: PayloadAction<SnippetItem | null>) => {
            state.selectedSnippet = action.payload;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchDirectoryContents.fulfilled, (state, action) => {
                state.currentDirectory = action.payload.directory;
                const directories = action.payload.subdirectories.map((dir: DirectoryItem) => ({
                    ...dir,
                    type: 'directory'
                }));

                const snippets = action.payload.snippets.map((snip: BinderItem) => ({
                    ...snip,
                    type: 'snippet' // Ensure all snippets have the 'snippet' type
                }));
                state.items = [...directories, ...snippets];
                state.loading = false;
            })
            .addCase(fetchDirectoryContents.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchDirectoryContents.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(updateSnippetContent.fulfilled, (state, action) => {
                const { snippetId, content } = action.payload;
                if (state.selectedSnippet && state.selectedSnippet.id === snippetId) {
                    state.selectedSnippet.content = content;
                }
                const index = state.items.findIndex(item => item.id === snippetId && item.type === 'snippet');
                if (index !== -1 && state.items[index].type === 'snippet') {
                    (state.items[index] as SnippetItem).content = content;
                }
            })
            .addCase(updateSnippetContent.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateSnippetContent.rejected, (state, action) => {
                state.error = action.payload as string;
                state.loading = false;
            })
            .addCase(addItemAsync.fulfilled, (state, action) => {
                state.items.push(action.payload);
            })
            .addCase(renameItemAsync.fulfilled, (state, action) => {
                const { itemId, type, newName } = action.payload;
                const index = state.items.findIndex(item => item.id === itemId && item.type === type);
                if (index !== -1) {
                    state.items[index] = { ...state.items[index], name: action.payload.name };
                    if (state.selectedSnippet && state.selectedSnippet.id === itemId && state.items[index].type === 'snippet') {
                        state.selectedSnippet.name = newName;
                    }
                }
            })
            .addCase(moveItemAsync.fulfilled, (state, action) => {
                const updatedItem = action.payload;

                const shouldRemove = (
                    (state.currentDirectory && state.currentDirectory.id !== updatedItem.directory_id) ||
                    (!state.currentDirectory && updatedItem.directory_id !== null)
                );

                if (shouldRemove) {
                    state.items = state.items.filter(item => item.id !== updatedItem.id || item.type !== updatedItem.type);
                } else {
                    const index = state.items.findIndex(item => item.id === updatedItem.id && item.type === updatedItem.type);
                    if (index !== -1) {
                        state.items[index] = { ...state.items[index], ...updatedItem };
                    }
                }
            })
            .addCase(deleteItemAsync.fulfilled, (state, action) => {
                const { itemId, type} = action.payload;
                state.items = state.items.filter(item => item.id !== itemId || item.type !== type);
                if (state.selectedSnippet?.id === itemId ) state.selectedSnippet = null;
            });
    }
});

export const { setSelectedSnippet } = itemSlice.actions;
export default itemSlice.reducer;