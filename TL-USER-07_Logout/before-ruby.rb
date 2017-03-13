require "selenium-webdriver"

class BeforeTest
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    # Here some example
    @driver.get "http://todo.app/"

    inputs = @testCase['testCases']
    inputs.each do |key,input|
      element = @driver.find_element :css => key
      element.send_keys input
    end

    buttonSubmit = @driver.find_element :css => ".uk-button-primary"
    buttonSubmit.click

    # puts "Page title is #{@driver.title}"
  end
end
