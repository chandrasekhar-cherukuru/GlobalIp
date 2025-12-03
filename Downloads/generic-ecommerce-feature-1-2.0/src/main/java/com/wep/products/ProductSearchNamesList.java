package com.wep.products;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Properties;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.Resource;
import java.io.BufferedReader;
import java.io.InputStreamReader;


import org.springframework.stereotype.Service;
@Service
public class ProductSearchNamesList {
	 private final List<String> wordList;
	
	 public ProductSearchNamesList() {
		super();
		this.wordList = initializeWordList();
	}

	 public static List<String> initializeWordList() {
	        List<String> words = new ArrayList<>();
	        Properties properties = new Properties();

	        // Define the path to the properties file relative to the project's root directory
	        String propertiesFilePath = "wordlist.properties";

	        try {
	        	Resource resource = new ClassPathResource(propertiesFilePath);
	            BufferedReader reader = new BufferedReader(new InputStreamReader(resource.getInputStream()));
	            properties.load(reader);
	            // Iterate over property names and add them to the list
	            for (String propertyName : properties.stringPropertyNames()) {
	                words.add(properties.getProperty(propertyName));
	            }
	        } catch (IOException e) {
	            e.printStackTrace();
	        }

	        return words;
	    }
	
	 public List<String> suggestWords(String inputCharacters) {
		    String input = inputCharacters.toLowerCase(); // Convert input to lowercase
		    List<String> suggestions = new ArrayList<>();

		    // Split the input by spaces
		    String[] inputWords = input.split("\\s+");

		    for (String word : wordList) {
		        boolean allMatch = true;
		        
		        // Check if the word contains spaces
		        if (word.contains(" ")) {
		            // If it contains spaces, split it by spaces
		            String[] wordsWithSpaces = word.toLowerCase().split("\\s+");
		            
		            // Check if each input word starts with the corresponding word with spaces
		            for (int i = 0; i < inputWords.length && i < wordsWithSpaces.length; i++) {
		                if (!wordsWithSpaces[i].startsWith(inputWords[i])) {
		                    allMatch = false;
		                    break;
		                }
		            }
		        } else {
		            // If it doesn't contain spaces, check if it starts with the entire input
		            if (!word.toLowerCase().startsWith(input)) {
		                allMatch = false;
		            }
		        }
		        
		        // If all input words match and the word is not already in suggestions, add it to suggestions
		        if (allMatch && !suggestions.contains(word)) {
		            suggestions.add(word);
		        }
		    }

		    return suggestions;
		}



}
