# ACPCE Writeup Maker 🎓

An automated, secure, and privacy-first academic writeup generator built for **Jawahar Education Society's A. C. Patil College of Engineering, Kharghar, Navi Mumbai**.

---

## 📖 The Origin Story

Ask any engineering student, and they will tell you the same thing: **creating academic writeups is the absolute biggest pain in student life.** 

Students spend countless hours copying text, manually formatting paragraphs, dragging and dropping screenshot images that break the entire layout, and struggling to align institutional headers and page footers. It is a tedious, repetitive, and time-consuming process that distracts from actual learning.

When we identified this problem, we decided to build a solution. **ACPCE Writeup Maker** was born out of a desire to eliminate formatting frustration. With this tool, students can copy-paste their raw experiment writeup content, add their images, enter their details, and immediately download a clean, official, and beautifully-formatted PDF template in seconds.

---

## ✨ Features

- **Official College Styling**: Formatted according to the official college template featuring the ACPCE crest/shield logo, institution address details, and header borders.
- **Auto-Justification**: Automatically justifies all paragraphs to maintain clean, professional document layout.
- **Bold Text Support**: Parse raw text bold styling (wrap text in `**double asterisks**`) directly into formatted bold outputs in the final PDF.
- **Repeating Headers & Footers**: Clean page pagination setup. The college header and page-aligned footer (student name, roll number, batch) repeat perfectly at the top and bottom of **every single page** when printed.
- **Screenshots & Output Section**: An optional step to drag and drop or browse local image files. Uploaded images are arranged and rendered automatically under an **Output:** section heading.
- **Privacy First**: No server databases are used. All temporary files (like uploaded image object URLs) are destroyed upon opening the print dialog or logging out.



*Developed by Tensor Talezz. Powered by modern CSS page-layout architecture.*
