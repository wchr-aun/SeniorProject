from google_images_download import google_images_download
import os

def downloadImages(keyword):
  response = google_images_download.googleimagesdownload()
  arguments = {
    'keywords': keyword,
    'limit': 10,
    'size': 'large',
    # 'format': 'jpg',
    'image_directory': keyword,
    'print_urls': True
  }
  paths = response.download(arguments)

def renameImages(keyword):
  oldFolder = os.getcwd() + '\\downloads\\' + keyword
  newFolder = os.getcwd() + '\\downloads\\pending_' + keyword.replace(' ', '-') + '_ver-'
  i = 1
  while True:
    if os.path.exists(newFolder + str(i)) == False:
      os.rename(oldFolder, newFolder + str(i))
      newFolder = newFolder + str(i)
      break
    i += 1
  
  i = 1
  for filename in os.listdir(newFolder + '\\'):
    fileType = filename.split('.')[-1]
    dst = keyword.replace(' ', '-') + str(i) + '.' + fileType
    src = newFolder + '\\' + filename
    dst = newFolder + '\\' + dst
    try:
      os.rename(src, dst)
    except:
      continue
    i += 1

if __name__ == '__main__':
  keyword = 'plastic'
  downloadImages(keyword)
  renameImages(keyword)
