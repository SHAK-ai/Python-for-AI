#OOP
# class 
    # method
    #     first arg must be self
    # attributes
    # class variable
    # constructor
    # def __init__(self,arg,arg1,...)

class Teacher():
    def __init__(self, teacher_id :int, teacher_name:str, teacher_org :str = "PIAIC") -> None:
        self.name : str = teacher_name
        self.id : int = teacher_id
        self.org : str = teacher_org
        self.org = "ASHREITECH"


    def speak(self, words :str):
        print(f"{self.name} is speaking {words}")

    def teach(self, subject :str):
        print(f"{self.name} teaches {subject} at {self.org}")


ob1 : Teacher = Teacher(987, "SHAK")

ob1.speak("Hello Ladies n Gentleman")
ob1.teach("MATH")
