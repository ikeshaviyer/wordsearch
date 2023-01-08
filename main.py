from uniseg.graphemecluster import grapheme_clusters
import random
from random import randint
from collections import Counter
import pandas as pd
import string

language = "en"
# language = "sa"

if language == "sa":
    words = """कर्म 
    भक्ति 
    धर्म 
    सत्यं 
    शान्ति
    भक्ति 
    अहिंसा 
    सर्वं 
    रामदूत
    एकं 
    हनुमान्
    लक्ष्मणः
    """
    n = 10
if language == "en":
    words = """Karma
    Bhakti
    Dharma
    Satyam
    Shanti
    Bhakti
    Ahimsa
    Sarvam
    Ramdoot
    Ekam
    Hanuman
    Lakshmana"""
    n = 12

words=words.split()

deft = '.'
wordsearch = [[deft for _ in range(n)] for _ in range(n)]

def get_string():
    # return "\n".join([" ".join(row) for row in wordsearch])
    return pd.DataFrame(wordsearch).to_html()
    # code = "<table>"
    # for row in wordsearch:
    #     code += "<tr>"
    #         for i in row:

    #     code += "</tr>"
    # join([" ".join(row) for row in wordsearch])

def display():
    print(get_string())

def get_dir(i0,j0,i1,j1):
    di = 0
    if i0 != i1:
        di = (i1 - i0) // abs(i1 - i0)
    dj = 0
    if j0 != j1:
        dj = (j1 - j0) // abs(j1 - j0)
    return di, dj

def get_length(i0,j0,i1,j1):
    return max(abs(i1-i0)+1, abs(j1-j0)+1)

def check_bounds(i0,j0,i1,j1):
    for x in [i0,j0,i1,j1]:
        assert(x >= 0)
        assert(x < n)

def free(i0, j0, i1, j1):
    # determines if the segment [(i0,j0), (i1,j1)] is not taken by other characters
    di, dj = get_dir(i0,j0,i1,j1)
    length = get_length(i0,j0,i1,j1)
    print("dir:", di,dj)
    print("i0:{},j0:{},i1:{},j1:{}".format(i0,i1,j0,j1))
    print("length:",length)
    for idx in range(length):
        if wordsearch[i0+idx*di][j0+idx*dj] != deft:
            return False
    return True

def write(i0,j0,i1,j1,chars):
    di,dj = get_dir(i0,j0,i1,j1)
    length = get_length(i0,j0,i1,j1)
    assert(len(chars) == length)
    for idx in range(length):
        assert(wordsearch[i0+idx*di][j0+idx*dj] == deft)
        wordsearch[i0+idx*di][j0+idx*dj] = chars[idx]

satisfiable = True

orient_counts = Counter()

for w in words:
    chars = list(grapheme_clusters(w.upper()))
    num_chars = len(chars)
    print(chars)
    cnt = 0
    threshold = 1000
    while True:
        cnt += 1
        if cnt > threshold:
            satisfiable = False
            break
        done = False
        orient = randint(0,30)
        flip = randint(0,1)
        if flip == 1:
            chars = list(reversed(chars))
        if orient <= 11:
            # horizontal
            i0 = randint(0,n-1)
            i1 = i0
            j0 = randint(0,n-num_chars)
            j1 = j0+num_chars-1
        elif orient <= 22:
            # vertical
            i0 = randint(0,n-num_chars)
            i1 = i0 + num_chars - 1
            j0 = randint(0,n-1)
            j1 = j0
        elif orient <= 26:
            # diagonal from bottom left to top right
            # i0 = randint(num_chars-1,n-1)
            # j0 = randint(0,n-num_chars)
            i0 = randint(num_chars-1,n-1)
            j0 = randint(0,n-num_chars)
            i1 = i0 - num_chars + 1
            j1 = j0 + num_chars - 1
        elif orient <= 30:
            # diagonal from top left to bottom right
            i0 = randint(0,n-num_chars)
            j0 = randint(0, n-num_chars)
            # i0 = randint(0,n-num_chars)
            i1 = i0 + num_chars - 1
            # j0 = randint(num_chars-1,n-1)
            j1 = j0 + num_chars - 1
        
        check_bounds(i0,j0,i1,j1)

        if free(i0,j0,i1,j1):
            # assert(num_chars == len(chars))
            orient_counts[orient] += 1
            write(i0,j0,i1,j1, chars)
            break

if not satisfiable:
    display()
    print("Word search not creatable given the current program")
else:
    display()
print("orient counts: {}".format(orient_counts))


answer = get_string()

def random_letter():
    if language == "en":
        return random.choice(list("ABCDEFGHIJKLMNOPQRSTUVWXYZ"))
    vowels = list("अआइईउऊऋॠऌॡएऐओऔ")
    consonants = list("कखगघङचछजझञटठडढणतथदधनपफबभमयरलळवशषसह")
    combiners = ["ा","ि","ी","ु","ू","ृ","ॄ","े","ै","ो","ौ","ौ","ं","ः","्"]
    l = random.randint(0,10)
    if l <= 3:
        char = random.choice(vowels)
    elif l <= 10:
        char = random.choice(consonants)
        l = random.randint(0, 10)
        if l <= 5:
            char += random.choice(combiners)
    return char

for i, _ in enumerate(wordsearch):
    for j, _ in enumerate(wordsearch[i]):
        if wordsearch[i][j] == deft:
            wordsearch[i][j] = random_letter()

with open("output.html", "w", encoding="utf-8") as f:
    f.write("<style>table, td {border: 0; padding: 5px 10px} th {display: none}</style>")
    f.write("<h1>Puzzle:</h1><br><br>")
    f.write(get_string())
    f.write("<br><br><h1>Words:</h1><br><br>")
    f.write("<br>\n".join(words))
    f.write("<br><br><h1>Answer:</h1><br><br>")
    f.write(answer)


# for i in range(n):
#     for j in range(n):
#         if wordsearch[i][j] == 


# a = ["a","b","c"]
# print(" ".join(a))

# for w in words:
#     for c in list(grapheme_clusters(w)):
#         print(w, c)