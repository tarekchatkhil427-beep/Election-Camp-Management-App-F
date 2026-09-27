export interface MockAsset {
  id: string;
  name: string;
  type: 'image' | 'video' | 'document' | 'other';
  driveFileId: string;
  driveUrl: string;
  thumbnailUrl?: string;
  uploader: string;
  campaignId: string;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdDate: string;
}

export class AssetRepository {
  /**
   * For now, this is a mock implementation.
   * Later, this class will connect to the actual Google Drive API using standard OAuth2 credentials.
   * Methods will map to google.drive('v3').files.* 
   */

  static async uploadAsset(file: File, campaignId: string, uploaderName: string): Promise<MockAsset> {
    console.log(`Mock: Uploading ${file.name} to Google Drive...`);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));

    // Return a mock asset with Google Drive placeholders
    return {
      id: `asset-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'document',
      driveFileId: `mock-drive-${Math.random().toString(36).substr(2, 9)}`,
      driveUrl: '#', // Placeholder for actual Google Drive preview/download URL
      thumbnailUrl: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      uploader: uploaderName,
      campaignId,
      approvalStatus: 'PENDING',
      createdDate: new Date().toISOString()
    };
  }

  static async getCampaignAssets(campaignId: string): Promise<MockAsset[]> {
    console.log(`Mock: Fetching assets from Google Drive for campaign ${campaignId}...`);
    // Simulated fetch
    return [];
  }

  static async deleteAsset(driveFileId: string): Promise<boolean> {
    console.log(`Mock: Deleting file ${driveFileId} from Google Drive...`);
    return true;
  }
}
