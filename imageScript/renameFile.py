import os

keyword = 'milkbox'
folder = 'D:\\github\\SeniorProject\\imageScript\\downloads\\labeling_milkbox'
i = 1
for filename in os.listdir(folder):
  fileType = filename.split('.')[-1]
  dst = keyword.replace(' ', '-') + str(i) + '.' + fileType
  src = folder + '\\' + filename
  dst = folder + '\\' + dst
  try:
    os.rename(src, dst)
  except:
    continue
  i += 1
