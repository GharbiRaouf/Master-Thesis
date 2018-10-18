# smart text generation
# from textgenrnn import textgenrnn

 

class TextGenRnn:
    def __init__ (self):
        self.TEXT_GEN = textgenrnn()
    def generate_some_texts(self,number=1,p="Suggestion/"):
        # generated_texts = self.TEXT_GEN.generate(n=number, prefix=p, temperature=0.4, return_as_list=True)
        generated_texts = self.TEXT_GEN.generate(return_as_list=True)
        return generated_texts

    def train_it_from_file(self,source='application/train/docs/sample.txt'):
        self.TEXT_GEN.train_from_file(source, num_epochs=1)


    def generate_it_to_file(self,destination='./output/textgenrnn_texts.txt'):
        self.TEXT_GEN.generate_to_file(destination, n=5)

# TEXT_GEN=TextGenRnn()
# TEXT_GEN.train_from_file()
# print(TEXT_GEN.generate_texts())