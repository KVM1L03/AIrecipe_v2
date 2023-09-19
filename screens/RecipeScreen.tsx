import React, { useState } from "react";
import {
  View,
  TextInput,
  Keyboard,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";
import axios from "axios";
import {API_KEY} from '@env'
import { Button, ProgressBar } from "react-native-paper";
import HeaderRecipe from "../components/HeaderRecipe";

const RecipeScreen: React.FC = () => {
  const [input, setInput] = useState<string>("");
  const [recipe, setRecipe] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  //Generating recipe from OpenAI gpt-3.5 API
  const generateRecipe = async () => {
    try {
      setLoading(true);
      const response = await axios.post(
        "https://api.openai.com/v1/chat/completions",
        {
          messages: [
            {
              role: "user",
              content: `Generate a recipe using the following products: ${input}. Make sure to include detailed instructions and a list of ingredients. Under the last line, give the number of calories in the form: 'Calories per serving: amount of calories.'`,
            },
            { role: "assistant", content: "recipe" },
          ],
          max_tokens: 500,
          model: "gpt-3.5-turbo",
          temperature: 0.7,
          top_p: 1,
          frequency_penalty: 1,
          presence_penalty: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${API_KEY}`,
          },
        }
      );
      const trimmedRecipe: string =
        response.data.choices[0].message.content.trim();
      setRecipe(trimmedRecipe);
      setLoading(false);
      Keyboard.dismiss();
      console.log(trimmedRecipe);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  //Trimming/cutting key informations from generated data
  const formatRecipeText = (text: string): JSX.Element => {
    const lines: string[] = text.split("\n");

    let recipeTitle: string = lines[0].trim();
    const ingredients: string[] = [];
    const recipeSteps: string[] = [];
    let currentSection: string | null = null;

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (line.endsWith(":")) {
        if (line.toLowerCase() === "ingredients:") {
          currentSection = "ingredients";
        } else {
          currentSection = null;
        }
      } else {
        if (currentSection === "ingredients") {
          ingredients.push(line);
        } else {
          recipeSteps.push(line);
        }
      }
    }

    const formattedRecipe: JSX.Element = (
      <View>
        <Text style={styles.recipeTitle}>{recipeTitle}</Text>
        <Text style={styles.sectionTitle}>Ingredients:</Text>
        {ingredients.map((ingredient: string, index: number) => (
          <Text key={`ingredient-${index}`} style={styles.recipeText}>
            {`${ingredient}`}{" "}
          </Text>
        ))}
        <Text style={styles.sectionTitle}>Recipe Steps:</Text>
        {recipeSteps.map((step: string, index: number) => (
          <Text key={`step-${index}`} style={styles.recipeText}>
            {" "}
            {step}
          </Text>
        ))}
      </View>
    );

    return formattedRecipe;
  };

  return (
    <View style={styles.container}>
      <HeaderRecipe />
      <TextInput
        defaultValue={input}
        editable={!loading}
        onChangeText={(text: string) => setInput(text)}
        placeholder="Enter ingredients:"
        cursorColor={"#000000"}
        style={{
          borderWidth: 2,
          borderColor: "#c4c4c4",
          padding: 20,
          borderRadius: 20,
          fontFamily: "PlayfairDisplay-Bold",
          fontSize: 16,
          marginTop: 20,
        }}
      />
      <Button
        onPress={generateRecipe}
        style={{ marginTop: 20, width: "50%", alignSelf: "center" }}
        labelStyle={{ fontFamily: "PlayfairDisplay-Bold" }}
        mode="elevated"
        textColor="#000000"
        buttonColor="#FF9001"
        disabled={loading}
      >
        Generate
      </Button>
      {loading ? (
        <ProgressBar
          indeterminate
          style={{ alignSelf: "center", marginTop: 50 }}
          color="#FF4200"
        />
      ) : (
        recipe !== "" && (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.recipeContainer}
          >
            {formatRecipeText(recipe)}
          </ScrollView>
        )
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  recipeContainer: {
    maxHeight: 600,
    marginTop: 30,
  },
  recipeTitle: {
    fontSize: 20,
    fontFamily: "PlayfairDisplay-Bold",
    marginBottom: 16,
    alignSelf: "center",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "PlayfairDisplay-Bold",
    marginTop: 8,
  },
  recipeText: {
    fontSize: 16,
    fontFamily: "PlayfairDisplay-Regular",
  },
});

export default RecipeScreen;
