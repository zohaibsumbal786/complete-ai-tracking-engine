import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';
import aiService from './ai.service';

class CVParserService {
  async parseFile(filePath: string): Promise<any> {
    const ext = path.extname(filePath).toLowerCase();
    let text = '';
    
    try {
      if (ext === '.pdf') {
        text = await this.parsePDF(filePath);
      } else if (ext === '.docx' || ext === '.doc') {
        text = await this.parseDOCX(filePath);
      } else if (ext === '.txt') {
        text = await this.parseTXT(filePath);
      } else {
        throw new Error('Unsupported file format');
      }
      
      // Use AI to extract structured data
      const parsedData = await aiService.parseCV(text);
      
      // Create bias-free version
      const biasFreeProfile = aiService.removeBias(parsedData);
      
      return {
        parsedData,
        biasFreeProfile,
        rawText: text
      };
    } catch (error: any) {
      console.error('CV parsing error:', error);
      throw new Error(`Failed to parse CV: ${error.message}`);
    }
  }
  
  private async parsePDF(filePath: string): Promise<string> {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }
  
  private async parseDOCX(filePath: string): Promise<string> {
    const result = await mammoth.extractRawText({ path: filePath });
    return result.value;
  }
  
  private async parseTXT(filePath: string): Promise<string> {
    return fs.readFileSync(filePath, 'utf-8');
  }
}

export default new CVParserService();
