require "selenium-webdriver"

class BeforeTest
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    # Here some example
    @driver.get "http://todo.app/"
    element = @driver.find_element :css => '[name="email"]'
    element.send_keys "john@doe.com"

    element = @driver.find_element :css => '[name="password"]'
    element.send_keys "qweasd123"

    buttonSubmit = @driver.find_element :css => ".uk-button-primary"
    buttonSubmit.click
    #
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element :css => "ul.users" }

    # puts "Page title is #{@driver.title}"
  end
end
