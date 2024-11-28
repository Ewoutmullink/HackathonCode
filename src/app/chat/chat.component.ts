import { Component, ElementRef, ViewChild, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgClass } from '@angular/common';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    NgClass
  ],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements AfterViewChecked {
  messages: { content: string; sender: string }[] = [];
  newMessage: string = '';
  @ViewChild('chatWindow') private chatWindow!: ElementRef;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  sendMessage() {
    if (this.newMessage.trim() !== '') {
      this.messages.push({ content: this.newMessage, sender: 'user' });
      this.newMessage = '';
      this.sendToLLM();
    }
  }

  async sendToLLM() {
    const userMessage = this.messages[this.messages.length - 1].content;

    const url = `http://localhost:8000/ask_question?question=${encodeURIComponent(userMessage)}`;

    this.messages.push({ content: '', sender: 'assistant' });
    const assistantMessageIndex = this.messages.length - 1;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Server error: ${response.statusText}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder('utf-8');

      if (reader) {
        let result = '';
        let done = false;

        while (!done) {
          const { value, done: readerDone } = await reader.read();
          done = readerDone;

          if (value) {
            const chunk = decoder.decode(value, { stream: true });
            result += chunk;
            this.messages[assistantMessageIndex].content = result;
            this.changeDetectorRef.detectChanges();
          }
        }
      }
    } catch (error) {
      console.error('Error fetching the answer:', error);
      this.messages[assistantMessageIndex].content =
        'An error occurred while fetching the answer.';
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatWindow.nativeElement.scrollTop = this.chatWindow.nativeElement.scrollHeight;
    } catch (err) {
      console.error(err);
    }
  }
}

