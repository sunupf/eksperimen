require "selenium-webdriver"

class Test
  def initialize(testCase,driver)
    @testCase =  testCase
    @driver =  driver
  end
  def run
    # Here some example
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element :css => "ul.users" }

    buttonSubmit = @driver.find_element :css => "ul.users li a"
    buttonSubmit.click
    # #
    wait = Selenium::WebDriver::Wait.new(:timeout => 30)
    wait.until { @driver.find_element :css => "#login-form" }

    respons = @driver.find_elements :css => "#login-form"

    if(!respons.empty?)
      return true
    else
      return false
    end
  end
end
